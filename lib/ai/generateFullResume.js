import { GoogleGenAI } from '@google/genai';

/**
 * Comprehensive AI prompt for generating a complete resume from minimal input
 */
export const FULL_RESUME_GENERATION_PROMPT = `You are an expert Bangladeshi resume writer. Generate a COMPLETE, professional resume from the minimal input provided.

CRITICAL RULES:
1. Generate ALL content in professional English
2. For FRESHERS: Create academic achievements, relevant coursework, projects, and soft skills instead of work experience
3. For EXPERIENCED: Generate detailed work experience with 4-5 quantified bullet points per role
4. NEVER invent fake company names or institutions - only infer skills/responsibilities appropriate for the role
5. Skills and tools MUST be relevant to the target job title and education field
6. Be culturally appropriate for Bangladesh job market

You will receive:
- Personal details
- Target job title
- Experience level (fresher/1-2/3-5/5+)
- Education details
- Optional current job info

Generate a complete resume JSON with ALL these sections:

{
  "careerObjective": "3-4 line compelling career objective tailored to target role...",
  
  "experience": [
    {
      "position": "Job Title",
      "company": "Company Name",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "• Bullet point 1 with metrics\\n• Bullet point 2\\n• Bullet point 3\\n• Bullet point 4"
    }
  ],
  
  "technicalSkills": ["Skill 1", "Skill 2", "...8-12 skills relevant to role"],
  
  "tools": ["Tool 1", "Tool 2", "...4-6 industry tools"],
  
  "extraCurricular": [
    {
      "activity": "Activity Name",
      "duration": "Year or Duration",
      "role": "Your Role",
      "impact": "Key achievement or impact"
    }
  ],
  
  "languages": [
    { "name": "Bengali", "proficiency": "Native" },
    { "name": "English", "proficiency": "Professional" }
  ],
  
  "references": [
    {
      "fullName": "Available upon request",
      "companyPosition": "",
      "phone": "",
      "email": ""
    }
  ],
  
  "declaration": "I hereby declare that all the information provided above is true to the best of my knowledge and belief."
}

FOR FRESHERS (no work experience):
- Leave "experience" as an empty array []
- Focus on academic projects, internships (if mentioned), coursework
- Add relevant soft skills and classroom/project achievements
- Extra-curricular should highlight leadership, teamwork, initiatives

RESPOND WITH VALID JSON ONLY. NO MARKDOWN CODE BLOCKS.`;

/**
 * Generate a complete resume from minimal user input using AI
 * @param {Object} quickInput - Minimal input from user
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} Complete resume data
 */
export async function generateFullResume(quickInput, apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Build context from input
  const isFresher = quickInput.experienceLevel === 'fresher' || quickInput.experienceLevel === 'Fresher / No Experience';

  const userPrompt = `Generate a complete resume for this person:

PERSONAL DETAILS:
- Full Name: ${quickInput.fullName}
- Email: ${quickInput.email}
- Phone: ${quickInput.phone || 'Not provided'}
- Location: ${quickInput.location || 'Bangladesh'}

CAREER GOAL:
- Target Job Title: ${quickInput.targetJobTitle}
- Experience Level: ${quickInput.experienceLevel} ${isFresher ? '(FRESHER - no work experience)' : ''}

EDUCATION:
- Highest Level: ${quickInput.highestEducation}
- Degree: ${quickInput.degree || 'Not specified'}
- Major/Field: ${quickInput.major || 'Not specified'}
- Institution: ${quickInput.institution || 'Not specified'}
- Passing Year: ${quickInput.passingYear || 'Not specified'}

${quickInput.currentCompany ? `CURRENT/RECENT JOB:
- Company: ${quickInput.currentCompany}
- Position: ${quickInput.currentPosition || 'Not specified'}` : 'NO CURRENT JOB PROVIDED - Generate appropriate content based on experience level'}

Remember:
${isFresher
      ? '- This is a FRESHER with NO work experience. Focus on academics, projects, skills, and potential.'
      : '- Generate realistic work experience with detailed bullet points for an experienced professional.'}
- Skills must match the target role: ${quickInput.targetJobTitle}
- Education field is: ${quickInput.major || quickInput.degree || 'general'}

Return ONLY valid JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { role: 'user', parts: [{ text: FULL_RESUME_GENERATION_PROMPT + '\n\n' + userPrompt }] }
    ],
    config: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    }
  });

  const text = response.text.trim();

  // Clean up any markdown code blocks if present
  let cleanJson = text;
  if (text.startsWith('```')) {
    cleanJson = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
  }

  const generatedContent = JSON.parse(cleanJson);

  // Merge with original input to create complete resume data
  return {
    // Personal details from input
    fullName: quickInput.fullName,
    email: quickInput.email,
    phone: quickInput.phone || '',
    location: quickInput.location || '',
    profilePhoto: null,

    // AI-generated content
    careerObjective: generatedContent.careerObjective || '',

    // Education - combine input with structure expected by ResumePDF
    education: {
      ssc: { passingYear: '', result: '', institution: '', subject: '' },
      hsc: { passingYear: '', result: '', institution: '', subject: '' },
      honors: quickInput.highestEducation === 'bachelor' || quickInput.highestEducation === 'Bachelor\'s' ? {
        passingYear: quickInput.passingYear || '',
        result: '',
        institution: quickInput.institution || '',
        degree: quickInput.degree || '',
        major: quickInput.major || ''
      } : { passingYear: '', result: '', institution: '', degree: '', major: '' },
      masters: quickInput.highestEducation === 'masters' || quickInput.highestEducation === 'Master\'s' ? {
        passingYear: quickInput.passingYear || '',
        result: '',
        institution: quickInput.institution || '',
        degree: quickInput.degree || '',
        major: quickInput.major || ''
      } : { passingYear: '', result: '', institution: '', degree: '', major: '' },
    },
    expandedEducation: ['honors'],

    // Experience
    experience: generatedContent.experience?.length > 0
      ? generatedContent.experience
      : [{ position: '', company: '', startDate: '', endDate: '', description: '' }],

    // Skills and tools
    technicalSkills: generatedContent.technicalSkills || [],
    tools: generatedContent.tools || [],

    // Extra-curricular
    extraCurricular: generatedContent.extraCurricular?.length > 0
      ? generatedContent.extraCurricular
      : [{ activity: '', duration: '', role: '', impact: '' }],

    // Languages
    languages: generatedContent.languages || [
      { name: 'Bengali', proficiency: 'Native' },
      { name: 'English', proficiency: 'Professional' }
    ],

    // References
    references: generatedContent.references || [
      { fullName: 'Available upon request', companyPosition: '', phone: '', email: '' }
    ],

    // Declaration
    declaration: generatedContent.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge and belief.',

    // LinkedIn placeholder
    linkedinUrl: '',

    // Metadata
    _generatedAt: new Date().toISOString(),
    _targetJobTitle: quickInput.targetJobTitle,
    _experienceLevel: quickInput.experienceLevel,
  };
}
