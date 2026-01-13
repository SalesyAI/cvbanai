import { GoogleGenAI } from '@google/genai';

export const RESUME_REFINEMENT_PROMPT = `You are an expert executive resume writer. Your goal is to create a complete, high-impact resume from the provided data.

CRITICAL INSTRUCTIONS:
1.  **INFER & GENERATE**: If any section (Summary, Skills, Tools) is missing or minimal, YOU MUST GENERATE IT based on the context of the provided Job Titles and Education.
    -   *Example*: If "Frontend Developer" is listed but Skills are empty, generate "React, JavaScript, CSS, HTML, Webpack" etc.
    -   *Example*: If Summary is empty, write a compelling executive summary based on the career trajectory.
2.  **EXPAND**: Transform all short descriptions into detailed, quantified professional bullet points (4-5 per role).
3.  **DO NOT LIE**: Do not invent companies or job titles. Only infer *skills* and *responsibilities* that are standard for the listed roles.
4.  **FILL THE PAGE**: The output must be voluminous and detailed.

RESPOND WITH VALID JSON ONLY.

Structure:
{
  "summary": "Compelling 4-5 line executive summary...",
  "workHistory": [
    {
      "company": "...",
      "position": "...",
      "startDate": "...",
      "endDate": "...",
      "bullets": ["High-impact bullet 1", "High-impact bullet 2", "High-impact bullet 3", "High-impact bullet 4", "High-impact bullet 5"]
    }
  ],
  "technicalSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
  "tools": ["Tool 1", "Tool 2", "Tool 3", "Tool 4"]
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
        technicalSkills: refinedContent.technicalSkills?.length > 0 ? refinedContent.technicalSkills : resumeData.technicalSkills,
        tools: refinedContent.tools?.length > 0 ? refinedContent.tools : resumeData.tools,
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
