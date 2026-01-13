import { GoogleGenAI } from '@google/genai';

/**
 * Comprehensive AI prompt for generating a complete resume from minimal input
 */
export const FULL_RESUME_GENERATION_PROMPT = `You are an expert Bangladeshi resume writer. Generate a COMPLETE, professional resume from the minimal input provided.

CRITICAL RULES:
1. Generate ALL content in professional English
2. For FRESHERS: Create academic achievements, relevant coursework, projects, and soft skills instead of work experience
3. For EXPERIENCED: Generate detailed work experience with 4 quantified bullet points per role
4. NEVER invent fake company names or institutions - only infer skills/responsibilities appropriate for the role
5. Skills and tools MUST be relevant to the target job title and education field
6. Be culturally appropriate for Bangladesh job market

You will receive:
- Personal details
- Target job title
- Experience level (fresher/1-2/3-5/5+)
- Education details (List of degrees)
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
  
  "skillCategories": [
    {
      "category": "Category Name (e.g., Programming Languages, Marketing Tools, Analysis)",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  
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

SKILL CATEGORIES GUIDELINES:
- Generate 3-5 relevant categories based on the target job title
- Each category should have 3-5 skills
- For TECH roles: Programming Languages, Frameworks, Databases, DevOps/Tools, Soft Skills
- For BUSINESS roles: Analysis & Research, Office & Productivity, Marketing/Sales Tools, Soft Skills
- For FINANCE roles: Accounting & Finance, ERP & Software, Analysis, Compliance & Regulations
- For FRESHERS: Include "Academic Skills" or "Coursework" as a category
- Always include a "Soft Skills" category with 3-4 relevant soft skills

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

  // Format education details for prompt
  let educationContext = "EDUCATION DETAILS:\n";
  const edu = quickInput.education || {};

  if (edu.masters) educationContext += `- Masters: ${edu.masters.degree} in ${edu.masters.major} from ${edu.masters.institution}\n`;
  if (edu.bachelors) educationContext += `- Bachelors: ${edu.bachelors.degree} in ${edu.bachelors.major} from ${edu.bachelors.institution}\n`;
  if (edu.hsc) educationContext += `- HSC/A-Level: ${edu.hsc.major} from ${edu.hsc.institution}\n`;
  if (edu.ssc) educationContext += `- SSC/O-Level: ${edu.ssc.major} from ${edu.ssc.institution}\n`;

  if (Object.keys(edu).length === 0) educationContext += "- No specific education details provided. Infer based on target job title.";

  const userPrompt = `Generate a complete resume for this person:

PERSONAL DETAILS:
- Full Name: ${quickInput.fullName}
- Email: ${quickInput.email}
- Phone: ${quickInput.phone || 'Not provided'}
- Location: ${quickInput.location || 'Bangladesh'}

CAREER GOAL:
- Target Job Title: ${quickInput.targetJobTitle}
- Experience Level: ${quickInput.experienceLevel} ${isFresher ? '(FRESHER - no work experience)' : ''}

${educationContext}

${quickInput.currentCompany ? `CURRENT/RECENT JOB:
- Company: ${quickInput.currentCompany}
- Position: ${quickInput.currentPosition || 'Not specified'}` : 'NO CURRENT JOB PROVIDED - Generate appropriate content based on experience level'}

Remember:
${isFresher
      ? '- This is a FRESHER with NO work experience. Focus on academics, projects, skills, and potential.'
      : '- Generate realistic work experience with detailed bullet points for an experienced professional.'}
- Skills must match the target role: ${quickInput.targetJobTitle}
- Generate 3-5 SKILL CATEGORIES appropriate for this role (not a flat list!)
- Education field is main specialization.

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

  // Helper to safely get education data
  const getEduData = (tier) => {
    const data = quickInput.education?.[tier] || {};
    return {
      passingYear: data.passingYear || '',
      result: data.result || '',
      institution: data.institution || '',
      degree: data.degree || '',
      major: data.major || '' // For SSC/HSC this maps to subject/group
    };
  };

  // Backward compatibility: if AI returns old format, convert it
  let skillCategories = generatedContent.skillCategories || [];
  if (skillCategories.length === 0 && generatedContent.technicalSkills) {
    // Convert flat list to a single category
    skillCategories = [
      { category: 'Technical Skills', skills: generatedContent.technicalSkills },
      { category: 'Tools & Software', skills: generatedContent.tools || [] }
    ].filter(cat => cat.skills.length > 0);
  }

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

    // Education - Map input structure to ResumePDF expected structure
    education: {
      ssc: {
        ...getEduData('ssc'),
        subject: quickInput.education?.ssc?.major || '' // Map major to subject for SSC
      },
      hsc: {
        ...getEduData('hsc'),
        subject: quickInput.education?.hsc?.major || '' // Map major to subject for HSC
      },
      honors: {
        ...getEduData('bachelors')
      },
      masters: {
        ...getEduData('masters')
      },
    },

    // Explicitly listing valid keys for ResumeEditor to know what exists
    expandedEducation: Object.keys(quickInput.education || {}).map(k => k === 'bachelors' ? 'honors' : k),

    // Experience
    experience: generatedContent.experience?.length > 0
      ? generatedContent.experience
      : [{ position: '', company: '', startDate: '', endDate: '', description: '' }],

    // Categorized Skills (NEW)
    skillCategories: skillCategories,

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
