import { GoogleGenAI } from '@google/genai';

export const ATS_ANALYSIS_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and technical recruiter. Your task is to analyze a resume against a job description and provide a realistic ATS match score and detailed feedback.

RULES:
1. ANALYSIS: Be brutally honest but constructive. 
2. SCORING: 
   - 0-40: Low match (major gaps)
   - 41-70: Moderate match (some alignment)
   - 71-100: High match (strong alignment)
3. KEYWORDS: identify specific technical and soft skills missing from the resume that are present in the job description.
4. REFORMATTING: Suggest layout or structural changes if they would improve ATS readability.

RESPOND WITH VALID JSON ONLY. No markdown, no code blocks, just raw JSON.

The response must follow this exact structure:
{
  "score": 85,
  "matchLevel": "High",
  "summary": "Short overview of the match",
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["list of what matches well"],
  "weaknesses": ["list of specific areas to improve"],
  "suggestedChanges": ["actionable advice to increase score"]
}`;

/**
 * Calculate ATS score using Google Gemini AI
 * @param {Object} resumeData - The candidate's resume data
 * @param {string} jobDescription - the target job description
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise<Object>} ATS Analysis results
 */
export async function calculateAtsScore(resumeData, jobDescription, apiKey) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `
RESUME TO ANALYZE:
Full Name: ${resumeData.fullName}
Experience: ${resumeData.workHistory?.map(job => `${job.position} at ${job.company}: ${job.description}`).join('\n')}
Skills: ${resumeData.skills?.join(', ')}
Summary: ${resumeData.summary}

TARGET JOB DESCRIPTION:
${jobDescription || 'Standard role based on candidate experience'}

Perform a deep ATS analysis. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
            { role: 'user', parts: [{ text: ATS_ANALYSIS_PROMPT + '\n\n' + userPrompt }] }
        ],
        config: {
            temperature: 0.2, // Lower temperature for more consistent scoring
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
