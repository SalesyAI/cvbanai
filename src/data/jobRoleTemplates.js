/**
 * Job role templates with suggested skills and tools
 * Used for autocomplete and AI generation assistance
 */

export const JOB_TITLE_SUGGESTIONS = [
    // Business & Management
    'Business Analyst',
    'Marketing Executive',
    'Marketing Manager',
    'Sales Executive',
    'Sales Manager',
    'HR Executive',
    'HR Manager',
    'Operations Manager',
    'Project Manager',
    'Product Manager',
    'Account Manager',
    'Business Development Executive',
    'Management Trainee',

    // Technology
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'Data Analyst',
    'Data Scientist',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'Web Developer',
    'IT Support Specialist',
    'Network Administrator',
    'System Administrator',

    // Finance & Accounting
    'Accountant',
    'Financial Analyst',
    'Auditor',
    'Tax Consultant',
    'Bank Officer',
    'Investment Analyst',

    // Creative
    'Graphic Designer',
    'Content Writer',
    'Copywriter',
    'Video Editor',
    'Social Media Manager',
    'Brand Manager',

    // Engineering
    'Civil Engineer',
    'Electrical Engineer',
    'Mechanical Engineer',
    'Industrial Engineer',

    // Healthcare
    'Medical Representative',
    'Pharmacist',
    'Lab Technician',

    // Education
    'Teacher',
    'Lecturer',
    'Academic Coordinator',

    // Entry Level
    'Intern',
    'Trainee',
    'Executive',
    'Officer',
    'Assistant',
];

export const EXPERIENCE_LEVELS = [
    { value: 'fresher', label: 'Fresher / No Experience' },
    { value: '1-2', label: '1-2 Years' },
    { value: '3-5', label: '3-5 Years' },
    { value: '5+', label: '5+ Years' },
];

export const EDUCATION_LEVELS = [
    { value: 'ssc', label: 'SSC / O-Level' },
    { value: 'hsc', label: 'HSC / A-Level' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
];

export const COMMON_DEGREES = [
    // Business
    'BBA', 'MBA', 'B.Com', 'M.Com',
    // Science & Engineering
    'BSc', 'MSc', 'B.Tech', 'M.Tech', 'BE', 'ME',
    // Arts & Humanities  
    'BA', 'MA', 'BFA', 'MFA',
    // Law
    'LLB', 'LLM',
    // Medical
    'MBBS', 'BDS', 'B.Pharm', 'M.Pharm',
    // Other
    'B.Ed', 'M.Ed', 'BCA', 'MCA', 'B.Arch',
];

export const COMMON_MAJORS = [
    // Business
    'Marketing', 'Finance', 'Accounting', 'Human Resource Management', 'Management',
    'International Business', 'Economics', 'Banking', 'Supply Chain Management',
    // Technology
    'Computer Science', 'Information Technology', 'Software Engineering',
    'Data Science', 'Artificial Intelligence', 'Cybersecurity',
    // Engineering
    'Electrical Engineering', 'Electronics Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Chemical Engineering', 'Industrial Engineering',
    // Science
    'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Biology', 'Biotechnology',
    // Arts
    'English', 'Bengali', 'History', 'Political Science', 'Sociology', 'Psychology',
    'Mass Communication', 'Journalism', 'Public Administration',
    // Medical
    'Medicine', 'Pharmacy', 'Nursing', 'Public Health',
];

/**
 * Role-specific skill and tool suggestions
 * Used when AI generates content for specific job titles
 */
export const JOB_ROLE_TEMPLATES = {
    'Business Analyst': {
        skills: ['Business Analysis', 'Requirements Gathering', 'Data Analysis', 'Process Mapping', 'SQL', 'Problem Solving', 'Stakeholder Management', 'Documentation'],
        tools: ['MS Excel', 'Power BI', 'Tableau', 'JIRA', 'Visio', 'SQL Server'],
    },
    'Marketing Executive': {
        skills: ['Digital Marketing', 'Social Media Marketing', 'Content Marketing', 'SEO/SEM', 'Market Research', 'Campaign Management', 'Brand Management', 'Analytics'],
        tools: ['Google Analytics', 'Google Ads', 'Facebook Ads Manager', 'Canva', 'Mailchimp', 'Hootsuite'],
    },
    'Software Engineer': {
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'Problem Solving', 'Agile', 'Data Structures'],
        tools: ['VS Code', 'Git', 'GitHub', 'Docker', 'AWS', 'Postman', 'JIRA'],
    },
    'Frontend Developer': {
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript', 'Responsive Design', 'UI/UX', 'REST APIs', 'Git'],
        tools: ['VS Code', 'Chrome DevTools', 'Figma', 'Git', 'npm', 'Webpack'],
    },
    'Data Analyst': {
        skills: ['Data Analysis', 'SQL', 'Python', 'Statistics', 'Data Visualization', 'Excel', 'ETL', 'Problem Solving'],
        tools: ['Excel', 'Python', 'SQL', 'Power BI', 'Tableau', 'Google Analytics'],
    },
    'Graphic Designer': {
        skills: ['Visual Design', 'Typography', 'Color Theory', 'Branding', 'Illustration', 'Layout Design', 'Print Design', 'Digital Design'],
        tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Canva', 'Adobe InDesign', 'CorelDRAW'],
    },
    'HR Executive': {
        skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'Payroll', 'Training & Development', 'HR Policies', 'Communication', 'MS Office'],
        tools: ['MS Excel', 'HRIS Systems', 'ATS Software', 'MS Word', 'Google Workspace'],
    },
    'Accountant': {
        skills: ['Financial Accounting', 'Tax Preparation', 'Auditing', 'Bookkeeping', 'Financial Reporting', 'Budgeting', 'Excel', 'Regulatory Compliance'],
        tools: ['MS Excel', 'QuickBooks', 'Tally', 'SAP', 'Oracle Financials'],
    },
    // Default template for roles not specifically defined
    '_default': {
        skills: ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'MS Office', 'Adaptability', 'Critical Thinking', 'Organization'],
        tools: ['MS Word', 'MS Excel', 'MS PowerPoint', 'Google Workspace', 'Email'],
    }
};

/**
 * Get template for a specific job role
 * Falls back to default if role not found
 */
export function getTemplateForRole(jobTitle) {
    // Try exact match first
    if (JOB_ROLE_TEMPLATES[jobTitle]) {
        return JOB_ROLE_TEMPLATES[jobTitle];
    }

    // Try partial match
    const lowerTitle = jobTitle.toLowerCase();
    for (const [role, template] of Object.entries(JOB_ROLE_TEMPLATES)) {
        if (role !== '_default' && lowerTitle.includes(role.toLowerCase())) {
            return template;
        }
    }

    // Return default
    return JOB_ROLE_TEMPLATES['_default'];
}
