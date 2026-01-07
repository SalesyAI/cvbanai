import { GoogleGenAI } from '@google/genai';

export const COVER_LETTER_PROMPT = `You are an expert career consultant and professional writer. Your task is to write a highly compelling, tailored, and persuasive cover letter for a candidate based on their resume data and a target job description.

RULES:
1. CUSTOMIZATION: Mention specific skills and experiences from the resume that directly solve the problems hinted at in the job description.
2. TONE: Professional yet enthusiastic. Avoid generic cliches (e.g., "I am writing to apply...").
3. STRUCTURE: 
   - A hook that grabs attention.
   - A middle section showing "Why Me" (evidence-based).
   - A "Why You" section showing knowledge of the company/role.
   - A clear call to action.
4. LENGTH: Keep it between 300-400 words.
5. FORMAT: Standard professional business letter format.

RESPOND WITH VALID JSON ONLY. No markdown, no code blocks, just raw JSON.

The response must follow this exact structure:
{
  "subject": "Compelling cover letter subject line",
  "letter": "The full text of the cover letter with proper newline characters (\\n)",
  "tips": ["3 quick tips on how to customize this letter further"]
}`;

/**
 * Generate a cover letter using Google Gemini AI
 * @param {Object} resumeData - The candidate's resume data
 * @param {string} jobDescription - the target job description
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<Object>} Generated cover letter data
 */
export async function generateCoverLetter(resumeData, jobDescription, apiKey) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `
RESUME DATA:
Full Name: ${resumeData.fullName}
Experience: ${resumeData.workHistory?.map(job => `${job.position} at ${job.company}`).join(', ')}
Key Skills: ${resumeData.skills?.join(', ')}
Summary: ${resumeData.summary}

TARGET JOB DESCRIPTION:
${jobDescription || 'Standard professional role based on candidate experience'}

Write a tailored cover letter following the rules. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: COVER_LETTER_PROMPT + '\n\n' + userPrompt }] }
        ],
        config: {
            temperature: 0.8,
            maxOutputTokens: 2048,
        }
    });

    const text = response.text.trim();

    // Clean up any markdown code blocks if present
    let cleanJson = text;
    if (text.startsWith('```')) {
        cleanJson = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return JSON.parse(cleanJson);
}
