import { GoogleGenAI } from '@google/genai';

export const RESUME_REFINEMENT_PROMPT = `You are an expert resume writer and career coach. Your task is to enhance a resume to be more professional, impactful, and ATS-optimized.

RULES:
1. Transform weak verbs into powerful action verbs (e.g., "worked on" → "spearheaded", "helped" → "collaborated with cross-functional teams")
2. Add quantifiable metrics where possible (e.g., percentages, numbers, dollar amounts)
3. Make descriptions more concise and impactful
4. Ensure professional tone throughout
5. Preserve all factual information - only enhance the language

RESPOND WITH VALID JSON ONLY. No markdown, no code blocks, just raw JSON.

The response must follow this exact structure:
{
  "summary": "enhanced professional summary",
  "summaryImprovements": ["list of improvements made to summary"],
  "workHistory": [
    {
      "company": "original company name",
      "position": "original position",
      "startDate": "original start date",
      "endDate": "original end date",
      "description": "enhanced description",
      "improvements": [
        { "original": "weak phrase that was changed", "improved": "the improved version" }
      ]
    }
  ]
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
        model: 'gemini-2.0-flash',
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
        summary: refinedContent.summary || resumeData.summary,
        summaryImprovements: refinedContent.summaryImprovements || [],
        workHistory: resumeData.workHistory?.map((job, index) => ({
            ...job,
            description: refinedContent.workHistory?.[index]?.description || job.description,
            improvements: refinedContent.workHistory?.[index]?.improvements || [],
        })) || [],
    };
}
