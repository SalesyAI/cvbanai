import { GoogleGenAI } from '@google/genai';

export const LINKEDIN_OPTIMIZATION_PROMPT = `You are an expert LinkedIn coach and personal branding specialist. Your task is to optimize a user's LinkedIn profile based on their answers to key questions.

RULES:
1. HEADLINE: Create a punchy, keyword-rich headline (max 120 chars) that highlights value, not just job title.
2. SUMMARY/ABOUT: Write a compelling About section (2000 chars max) in first person. Start with a hook, include achievements, and end with a call to action.
3. EXPERIENCE: Provide bullet points for their current/recent role that are achievement-focused with quantifiable results where possible.
4. TONE: Professional yet personable. Avoid corporate jargon.

RESPOND WITH VALID JSON ONLY. No markdown, no code blocks, just raw JSON.

The response must follow this exact structure:
{
  "headline": "The optimized LinkedIn headline",
  "about": "The full About/Summary section with proper line breaks as \\n",
  "experienceBullets": ["Achievement 1", "Achievement 2", "Achievement 3"],
  "tips": ["Tip 1 for networking", "Tip 2 for visibility"]
}`;

/**
 * Generate optimized LinkedIn profile content using Google Gemini AI
 * @param {Object} answers - User's questionnaire answers
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<Object>} Optimized LinkedIn content
 */
export async function optimizeLinkedIn(answers, apiKey) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `
LINKEDIN PROFILE DATA:
Current Headline: ${answers.currentHeadline || 'Not provided'}
Target Industry: ${answers.targetIndustry}
Career Goal: ${answers.careerGoal}
Key Skills: ${answers.keySkills}
Biggest Achievement: ${answers.biggestAchievement}
Ideal Role: ${answers.idealRole || 'Not specified'}
Years of Experience: ${answers.yearsExperience || 'Not specified'}

Generate an optimized LinkedIn profile. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            { role: 'user', parts: [{ text: LINKEDIN_OPTIMIZATION_PROMPT + '\n\n' + userPrompt }] }
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
