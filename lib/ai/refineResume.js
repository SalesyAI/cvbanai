import { GoogleGenAI } from '@google/genai';

export const RESUME_REFINEMENT_PROMPT = `You are an expert executive resume writer. Your goal is to rewrite the provided resume data to be extremely professional, detailed, and voluminous enough to fill a full A4 page.

CRITICAL RULES:
1.  **EXPAND & ELABORATE**: unique minimal input (e.g., "Fixed bugs") must be expanded into a full, professional bullet point (e.g., "Identified and resolved critical software defects, improving system stability and reducing user-reported issues by 15%.").
2.  **NO WHITESPACE**: The goal is to fill space. Generate long, descriptive, and dense paragraphs or bullet points.
3.  **DO NOT LIE**: Do not invent new jobs, companies, or degrees. Only expand on the *existing* information provided.
4.  **PROFESSIONAL TONE**: Use high-level corporate vocabulary (e.g., "Spearheaded", "Orchestrated", "Optimized").
5.  **STRUCTURE**:
    -   **Summary**: Write a robust 4-5 line professional summary.
    -   **Experience**: For each role, generate at least 4-5 detailed bullet points.
    -   **Skills**: Group skills logically if possible, or list them in a way that looks substantial.

RESPOND WITH VALID JSON ONLY.

Structure:
{
  "summary": "Full professional summary...",
  "workHistory": [
    {
      "company": "...",
      "position": "...",
      "startDate": "...",
      "endDate": "...",
      "description": "...", 
      "bullets": ["Detailed bullet 1", "Detailed bullet 2", "Detailed bullet 3", "Detailed bullet 4"] 
    }
  ],
  "technicalSkills": ["Skill 1", "Skill 2"...]
}`;

/**
 * Refine resume data using Google Gemini AI
 * @param {Object} resumeData - The original resume data
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<Object>} Refined resume data
 */
export async function refineResume(resumeData, apiKey) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `Here is the resume data to enhance:

FULL NAME: ${resumeData.fullName}
EMAIL: ${resumeData.email}
PHONE: ${resumeData.phone}
LOCATION: ${resumeData.location}

SUMMARY:
${resumeData.summary || 'No summary provided'}

WORK HISTORY:
${resumeData.workHistory?.map((job, i) => `
Job ${i + 1}:
- Company: ${job.company}
- Position: ${job.position}
- Duration: ${job.startDate} to ${job.endDate}
- Description: ${job.description}
`).join('\n') || 'No work history provided'}

EDUCATION:
${resumeData.education?.map((edu, i) => `
Education ${i + 1}:
- Institution: ${edu.institution}
- Degree: ${edu.degree}
- Field: ${edu.field}
- Year: ${edu.graduationYear}
`).join('\n') || 'No education provided'}

SKILLS: ${resumeData.skills?.join(', ') || 'No skills provided'}

Enhance this resume following the rules. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: RESUME_REFINEMENT_PROMPT + '\n\n' + userPrompt }] }
        ],
        config: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        }
    });

    const text = response.text.trim();

    // Clean up any markdown code blocks if present
    let cleanJson = text;
    if (text.startsWith('```')) {
        cleanJson = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const refinedContent = JSON.parse(cleanJson);

    // Merge refined content with original data
    return {
        ...resumeData,
        careerObjective: refinedContent.summary || resumeData.careerObjective, // Map summary to careerObjective
        technicalSkills: refinedContent.technicalSkills || resumeData.technicalSkills,
        experience: resumeData.experience?.map((job, index) => {
            const refinedJob = refinedContent.workHistory?.[index];
            return {
                ...job,
                // Prefers bullets if available, otherwise description, otherwise original
                description: refinedJob?.bullets
                    ? refinedJob.bullets.join('\n• ') // Format as bullet list string
                    : (refinedJob?.description || job.description)
            };
        }) || [],
    };
}
