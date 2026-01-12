import { useState, useRef, useEffect } from 'react'
import {
    ArrowLeft, ArrowRight, Plus, Trash2, X, Check, Copy, Download,
    User, Mail, Phone, MapPin, Camera, Linkedin, ChevronDown, ChevronUp,
    Briefcase, GraduationCap, Award, Languages, Users, FileCheck, Sparkles
} from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumePDF from './ResumePDF'

const STEPS = [
    { id: 'personal', title: 'Personal Details', subtitle: 'Tell us about yourself' },
    { id: 'academic', title: 'Academic Background', subtitle: 'Your educational journey' },
    { id: 'experience', title: 'Experience & Skills', subtitle: 'Professional history & tools' },
    { id: 'finalize', title: 'Finalize & Generate', subtitle: 'Review and generate your CV' },
]

const EDUCATION_CATEGORIES = [
    { id: 'ssc', label: 'Secondary (SSC)', optional: false },
    { id: 'hsc', label: 'Higher Secondary (HSC)', optional: false },
    { id: 'honors', label: 'Honors / Bachelor\'s', optional: false },
    { id: 'masters', label: 'Masters / Post-Grad', optional: true },
]

const TOOL_OPTIONS = [
    'Figma', 'Photoshop', 'Illustrator', 'MS Word', 'MS Excel', 'MS PowerPoint',
    'Google Docs', 'Canva', 'Notion', 'Trello', 'Slack', 'VS Code'
]

const PROFICIENCY_LEVELS = ['Native', 'Professional', 'Fluent', 'Intermediate', 'Basic']

const YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i)

export default function CVGeneratorFlow({ onComplete, onBack }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [direction, setDirection] = useState('next')
    const [copied, setCopied] = useState(false)
    const [generateState, setGenerateState] = useState('idle') // idle, generating, preview
    const contentRef = useRef(null)

    const [formData, setFormData] = useState({
        // Step 1: Personal
        profilePhoto: null,
        fullName: '',
        email: '',
        phone: '',
        location: '',
        careerObjective: '',

        // Step 2: Academic
        education: {
            ssc: { passingYear: '', result: '', institution: '', subject: '' },
            hsc: { passingYear: '', result: '', institution: '', subject: '' },
            honors: { passingYear: '', result: '', institution: '', degree: '', major: '' },
            masters: { passingYear: '', result: '', institution: '', degree: '', major: '' },
        },
        expandedEducation: ['ssc'],

        // Step 3: Experience & Skills
        experience: [{ position: '', company: '', startDate: '', endDate: '' }],
        technicalSkills: [],
        tools: [],
        extraCurricular: [{ activity: '', duration: '', role: '', impact: '' }],
        linkedinUrl: '',

        // Step 4: Finalize
        languages: [{ name: '', proficiency: 'Professional' }],
        references: [{ fullName: '', companyPosition: '', phone: '', email: '' }],
        declaration: '',
    })

    const [skillInput, setSkillInput] = useState('')

    // Update field helper
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Education helpers
    const updateEducation = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [category]: { ...prev.education[category], [field]: value }
            }
        }))
    }

    const toggleEducationSection = (id) => {
        setFormData(prev => ({
            ...prev,
            expandedEducation: prev.expandedEducation.includes(id)
                ? prev.expandedEducation.filter(e => e !== id)
                : [...prev.expandedEducation, id]
        }))
    }

    // Experience helpers
    const updateExperience = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { position: '', company: '', startDate: '', endDate: '' }]
        }))
    }

    const removeExperience = (index) => {
        if (formData.experience.length > 1) {
            setFormData(prev => ({
                ...prev,
                experience: prev.experience.filter((_, i) => i !== index)
            }))
        }
    }

    // Skills helpers
    const addSkill = () => {
        if (skillInput.trim() && !formData.technicalSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technicalSkills: [...prev.technicalSkills, skillInput.trim()]
            }))
            setSkillInput('')
        }
    }

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            technicalSkills: prev.technicalSkills.filter(s => s !== skill)
        }))
    }

    const toggleTool = (tool) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.includes(tool)
                ? prev.tools.filter(t => t !== tool)
                : [...prev.tools, tool]
        }))
    }

    // Extra-curricular helpers
    const updateExtraCurricular = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            extraCurricular: prev.extraCurricular.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addExtraCurricular = () => {
        setFormData(prev => ({
            ...prev,
            extraCurricular: [...prev.extraCurricular, { activity: '', duration: '', role: '', impact: '' }]
        }))
    }

    const removeExtraCurricular = (index) => {
        if (formData.extraCurricular.length > 1) {
            setFormData(prev => ({
                ...prev,
                extraCurricular: prev.extraCurricular.filter((_, i) => i !== index)
            }))
        }
    }

    // Language helpers
    const updateLanguage = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addLanguage = () => {
        setFormData(prev => ({
            ...prev,
            languages: [...prev.languages, { name: '', proficiency: 'Professional' }]
        }))
    }

    const removeLanguage = (index) => {
        if (formData.languages.length > 1) {
            setFormData(prev => ({
                ...prev,
                languages: prev.languages.filter((_, i) => i !== index)
            }))
        }
    }

    // Reference helpers
    const updateReference = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            references: prev.references.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            references: [...prev.references, { fullName: '', companyPosition: '', phone: '', email: '' }]
        }))
    }

    const removeReference = (index) => {
        if (formData.references.length > 1) {
            setFormData(prev => ({
                ...prev,
                references: prev.references.filter((_, i) => i !== index)
            }))
        }
    }

    // Navigation
    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setDirection('next')
            setCurrentStep(prev => prev + 1)
            contentRef.current?.scrollTo(0, 0)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection('prev')
            setCurrentStep(prev => prev - 1)
            contentRef.current?.scrollTo(0, 0)
        }
    }

    // Handle generate
    const handleGenerate = async () => {
        setGenerateState('generating')

        // Auto-enhance before generating
        try {
            const response = await fetch('http://localhost:3001/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: formData })
            })
            const data = await response.json()
            if (data.refinedData) {
                setFormData(data.refinedData)
            }
        } catch (error) {
            console.error('Auto-enhancement failed:', error)
            // Proceed anyway if enhancement fails
        }

        setGenerateState('preview')
    }

    // Handle Enhance
    const [isEnhancing, setIsEnhancing] = useState(false)

    const handleEnhance = async () => {
        setIsEnhancing(true)
        try {
            const response = await fetch('http://localhost:3001/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: formData })
            })
            const data = await response.json()
            if (data.refinedData) {
                setFormData(data.refinedData)
            }
        } catch (error) {
            console.error('Enhancement failed:', error)
        } finally {
            setIsEnhancing(false)
        }
    }

    // Copy text
    const handleCopyText = () => {
        const text = formatCVAsText()
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatCVAsText = () => {
        let text = `${formData.fullName}\n${formData.email} | ${formData.phone} | ${formData.location}\n\n`
        text += `CAREER OBJECTIVE\n${formData.careerObjective}\n\n`
        text += `EDUCATION\n`
        EDUCATION_CATEGORIES.forEach(cat => {
            const edu = formData.education[cat.id]
            if (edu.institution) {
                text += `${cat.label}: ${edu.institution} (${edu.passingYear}) - ${edu.result}\n`
            }
        })
        text += `\nEXPERIENCE\n`
        formData.experience.forEach(exp => {
            if (exp.position) {
                text += `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n`
            }
        })
        text += `\nSKILLS\n${formData.technicalSkills.join(', ')}\n`
        text += `\nTOOLS\n${formData.tools.join(', ')}\n`
        return text
    }

    // Calculate ATS score (simplified)
    const calculateATSScore = () => {
        let score = 0
        if (formData.fullName) score += 10
        if (formData.email) score += 10
        if (formData.phone) score += 5
        if (formData.careerObjective.length > 50) score += 15
        if (formData.education.ssc.institution) score += 10
        if (formData.education.hsc.institution) score += 10
        if (formData.experience[0]?.position) score += 15
        if (formData.technicalSkills.length >= 3) score += 15
        if (formData.tools.length >= 2) score += 5
        if (formData.languages[0]?.name) score += 5
        return Math.min(score, 98)
    }

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updateField('profilePhoto', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
    const labelClass = "block text-sm font-medium text-text-light-primary dark:text-gray-300 mb-2"

    // Render Step 1: Personal Details
    const renderPersonalDetails = () => (
        <div className="space-y-5">
            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-light-200 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-light-300 dark:border-dark-600">
                        {formData.profilePhoto ? (
                            <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-text-light-secondary/50 dark:text-gray-600" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 dark:bg-primary-400 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <Camera className="w-4 h-4" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500" />
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className={`${inputClass} pl-11`}
                        placeholder="Your full name"
                    />
                </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className={`${inputClass} pl-11`}
                            placeholder="your@email.com"
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500" />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className={`${inputClass} pl-11`}
                            placeholder="+880 1XXX-XXXXXX"
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div>
                <label className={labelClass}>Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500" />
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        className={`${inputClass} pl-11`}
                        placeholder="City, Country"
                    />
                </div>
            </div>

            {/* Career Objective */}
            <div>
                <label className={labelClass}>Career Objective</label>
                <textarea
                    value={formData.careerObjective}
                    onChange={(e) => updateField('careerObjective', e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="A brief statement about your career goals and what you bring to employers..."
                />
            </div>
        </div>
    )

    // Render Step 2: Academic Background
    const renderAcademicBackground = () => (
        <div className="space-y-3">
            {EDUCATION_CATEGORIES.map((cat) => {
                const isExpanded = formData.expandedEducation.includes(cat.id)
                const edu = formData.education[cat.id]
                const hasData = edu.institution || edu.passingYear || edu.result

                return (
                    <div key={cat.id} className="border border-light-200 dark:border-dark-700 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleEducationSection(cat.id)}
                            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isExpanded ? 'bg-primary-500/5 dark:bg-primary-500/10' : 'hover:bg-light-50 dark:hover:bg-dark-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                <GraduationCap className={`w-5 h-5 ${hasData ? 'text-primary-500 dark:text-primary-400' : 'text-text-light-secondary/50 dark:text-gray-500'}`} />
                                <span className="font-medium text-text-light-primary dark:text-white">
                                    {cat.label}
                                    {cat.optional && <span className="text-text-light-secondary dark:text-gray-500 font-normal ml-2">(Optional)</span>}
                                </span>
                                {hasData && <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-text-light-secondary dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-text-light-secondary dark:text-gray-400" />}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 pt-0 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Passing Year</label>
                                        <select
                                            value={edu.passingYear}
                                            onChange={(e) => updateEducation(cat.id, 'passingYear', e.target.value)}
                                            className={inputClass}
                                        >
                                            <option value="">Select Year</option>
                                            {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Result / GPA</label>
                                        <input
                                            type="text"
                                            value={edu.result}
                                            onChange={(e) => updateEducation(cat.id, 'result', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g., 4.00 / A+"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Institution</label>
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(cat.id, 'institution', e.target.value)}
                                        className={inputClass}
                                        placeholder="School / College / University"
                                    />
                                </div>
                                {/* Different fields for SSC/HSC vs Bachelor's/Master's */}
                                {(cat.id === 'ssc' || cat.id === 'hsc') ? (
                                    <div>
                                        <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Group / Subject</label>
                                        <input
                                            type="text"
                                            value={edu.subject}
                                            onChange={(e) => updateEducation(cat.id, 'subject', e.target.value)}
                                            className={inputClass}
                                            placeholder="e.g., Science, Commerce, Arts"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Degree Name</label>
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(cat.id, 'degree', e.target.value)}
                                                className={inputClass}
                                                placeholder="e.g., B.Sc, BBA, MBA"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-text-light-secondary dark:text-gray-400 mb-1 block">Major</label>
                                            <input
                                                type="text"
                                                value={edu.major}
                                                onChange={(e) => updateEducation(cat.id, 'major', e.target.value)}
                                                className={inputClass}
                                                placeholder="e.g., Computer Science"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )

    // Render Step 3: Experience & Skills
    const renderExperienceSkills = () => (
        <div className="space-y-6">
            {/* Professional Experience */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary-500" /> Professional Experience
                </h3>
                <div className="space-y-3">
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-light-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-primary-500 dark:text-primary-400">Position #{index + 1}</span>
                                {formData.experience.length > 1 && (
                                    <button onClick={() => removeExperience(index)} className="p-1 text-text-light-secondary hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                    className={inputClass}
                                    placeholder="Job Title"
                                />
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                    className={inputClass}
                                    placeholder="Company"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                    className={inputClass}
                                    placeholder="Start (Jan 2022)"
                                />
                                <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                    className={inputClass}
                                    placeholder="End (Present)"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addExperience}
                        className="w-full py-3 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-xl text-text-light-secondary dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add another position
                    </button>
                </div>
            </div>

            {/* Technical Skills */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3">Technical Skills</h3>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className={`flex-1 ${inputClass}`}
                        placeholder="Type a skill and press Enter"
                    />
                    <button onClick={addSkill} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors">
                        Add
                    </button>
                </div>
                {formData.technicalSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.technicalSkills.map((skill, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tools */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3">Tools</h3>
                <div className="flex flex-wrap gap-2">
                    {TOOL_OPTIONS.map((tool) => (
                        <button
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.tools.includes(tool)
                                ? 'bg-primary-500 text-white'
                                : 'bg-light-100 dark:bg-dark-700 text-text-light-secondary dark:text-gray-400 hover:bg-light-200 dark:hover:bg-dark-600'
                                }`}
                        >
                            {tool}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extra-Curricular */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary-500" /> Extra-Curricular Activities
                </h3>
                <div className="space-y-3">
                    {formData.extraCurricular.map((item, index) => (
                        <div key={index} className="p-4 bg-light-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-primary-500 dark:text-primary-400">Activity #{index + 1}</span>
                                {formData.extraCurricular.length > 1 && (
                                    <button onClick={() => removeExtraCurricular(index)} className="p-1 text-text-light-secondary hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={item.activity}
                                    onChange={(e) => updateExtraCurricular(index, 'activity', e.target.value)}
                                    className={inputClass}
                                    placeholder="Activity Name"
                                />
                                <input
                                    type="text"
                                    value={item.duration}
                                    onChange={(e) => updateExtraCurricular(index, 'duration', e.target.value)}
                                    className={inputClass}
                                    placeholder="Duration"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={item.role}
                                    onChange={(e) => updateExtraCurricular(index, 'role', e.target.value)}
                                    className={inputClass}
                                    placeholder="Your Role"
                                />
                                <input
                                    type="text"
                                    value={item.impact}
                                    onChange={(e) => updateExtraCurricular(index, 'impact', e.target.value)}
                                    className={inputClass}
                                    placeholder="Key Impact"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addExtraCurricular}
                        className="w-full py-3 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-xl text-text-light-secondary dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add another activity
                    </button>
                </div>
            </div>

            {/* LinkedIn */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3">Online Presence</h3>
                <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A66C2]" />
                    <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => updateField('linkedinUrl', e.target.value)}
                        className={`${inputClass} pl-11`}
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>
            </div>
        </div>
    )

    // Render Step 4: Finalize
    const renderFinalize = () => (
        <div className="space-y-6">
            {/* Enhance Button */}
            <div className="p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20 text-center">
                <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-text-light-primary dark:text-white mb-1">Enhance with AI</h3>
                <p className="text-sm text-text-light-secondary dark:text-gray-400 mb-4">
                    Automatically expand your bullet points, improve grammar, and fill the page with professional content.
                </p>
                <button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                    {isEnhancing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enhancing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Enhance My Resume
                        </>
                    )}
                </button>
            </div>

            {/* ATS Score Card */}
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-primary-500/10 dark:from-green-500/20 dark:to-primary-500/20 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileCheck className="w-8 h-8 text-green-500" />
                        <div>
                            <h3 className="font-semibold text-text-light-primary dark:text-white">ATS Compatibility</h3>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Resume optimization score</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-green-500">{calculateATSScore()}%</span>
                        <p className="text-xs text-green-600 dark:text-green-400">Optimized</p>
                    </div>
                </div>
            </div>

            {/* Languages */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary-500" /> Languages
                </h3>
                <div className="space-y-3">
                    {formData.languages.map((lang, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={lang.name}
                                onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                className={`flex-1 ${inputClass}`}
                                placeholder="Language"
                            />
                            <select
                                value={lang.proficiency}
                                onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                className={`flex-1 ${inputClass}`}
                            >
                                {PROFICIENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                            {formData.languages.length > 1 && (
                                <button onClick={() => removeLanguage(index)} className="p-2 text-text-light-secondary hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button onClick={addLanguage} className="text-sm text-primary-500 hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add another language
                    </button>
                </div>
            </div>

            {/* References */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-500" /> References
                </h3>
                <div className="space-y-3">
                    {formData.references.map((ref, index) => (
                        <div key={index} className="p-4 bg-light-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-primary-500 dark:text-primary-400">Reference #{index + 1}</span>
                                {formData.references.length > 1 && (
                                    <button onClick={() => removeReference(index)} className="p-1 text-text-light-secondary hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={ref.fullName}
                                    onChange={(e) => updateReference(index, 'fullName', e.target.value)}
                                    className={inputClass}
                                    placeholder="Full Name"
                                />
                                <input
                                    type="text"
                                    value={ref.companyPosition}
                                    onChange={(e) => updateReference(index, 'companyPosition', e.target.value)}
                                    className={inputClass}
                                    placeholder="Company & Position"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="tel"
                                    value={ref.phone}
                                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                                    className={inputClass}
                                    placeholder="Phone"
                                />
                                <input
                                    type="email"
                                    value={ref.email}
                                    onChange={(e) => updateReference(index, 'email', e.target.value)}
                                    className={inputClass}
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={addReference} className="text-sm text-primary-500 hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add another reference
                    </button>
                </div>
            </div>

            {/* Declaration */}
            <div>
                <h3 className="text-sm font-semibold text-text-light-primary dark:text-white mb-3">Declaration <span className="text-text-light-secondary font-normal">(Optional)</span></h3>
                <textarea
                    value={formData.declaration}
                    onChange={(e) => updateField('declaration', e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="I hereby declare that the above information is true to the best of my knowledge..."
                />
            </div>
        </div>
    )

    // Render generating state
    const renderGenerating = () => (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="mb-8">
                <p className="loader"><span>Generating</span></p>
            </div>
            <h2 className="text-xl font-bold mb-2 text-text-light-primary dark:text-white">Creating Your CV<span className="loading-dots"></span></h2>
            <p className="text-text-light-secondary dark:text-gray-400 text-sm">Our AI is formatting your information into a professional resume</p>
        </div>
    )

    // Render preview state
    const renderPreview = () => (
        <div className="space-y-6 animate-slide-up">
            {/* Success Header */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-text-light-primary dark:text-white">Your CV is Ready!</h2>
                <p className="text-sm text-text-light-secondary dark:text-gray-400">Preview your resume below</p>
            </div>

            {/* Resume Preview Card */}
            <div className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl p-6 shadow-lg">
                {/* Header */}
                <div className="border-b border-light-200 dark:border-dark-700 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-text-light-primary dark:text-white">{formData.fullName || 'Your Name'}</h3>
                    <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-1">
                        {[formData.email, formData.phone, formData.location].filter(Boolean).join(' • ')}
                    </p>
                </div>

                {/* Career Objective */}
                {formData.careerObjective && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">Career Objective</h4>
                        <p className="text-sm text-text-light-primary dark:text-gray-300">{formData.careerObjective}</p>
                    </div>
                )}

                {/* Education */}
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">Education</h4>
                    {EDUCATION_CATEGORIES.map(cat => {
                        const edu = formData.education[cat.id]
                        if (!edu.institution) return null
                        return (
                            <div key={cat.id} className="text-sm mb-1">
                                <span className="font-medium text-text-light-primary dark:text-white">{edu.institution}</span>
                                <span className="text-text-light-secondary dark:text-gray-400"> — {cat.label} ({edu.passingYear}) - {edu.result}</span>
                            </div>
                        )
                    })}
                </div>

                {/* Experience */}
                {formData.experience[0]?.position && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">Experience</h4>
                        {formData.experience.map((exp, i) => (
                            exp.position && (
                                <div key={i} className="text-sm mb-1">
                                    <span className="font-medium text-text-light-primary dark:text-white">{exp.position}</span>
                                    <span className="text-text-light-secondary dark:text-gray-400"> at {exp.company} ({exp.startDate} - {exp.endDate})</span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Skills */}
                {formData.technicalSkills.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {formData.technicalSkills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-light-100 dark:bg-dark-700 text-text-light-primary dark:text-gray-300 rounded text-xs">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tools */}
                {formData.tools.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">Tools</h4>
                        <p className="text-sm text-text-light-secondary dark:text-gray-400">{formData.tools.join(', ')}</p>
                    </div>
                )}
            </div>

            {/* ATS Score */}
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-primary-500/10 dark:from-green-500/20 dark:to-primary-500/20 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-green-500" />
                        <span className="font-medium text-text-light-primary dark:text-white">ATS Compatibility</span>
                    </div>
                    <span className="text-lg font-bold text-green-500">{calculateATSScore()}% Optimized</span>
                </div>
            </div>
        </div>
    )

    const renderStepContent = () => {
        // Handle special states for Step 4
        if (currentStep === STEPS.length - 1) {
            if (generateState === 'generating') return renderGenerating()
            if (generateState === 'preview') return renderPreview()
        }

        switch (STEPS[currentStep].id) {
            case 'personal': return renderPersonalDetails()
            case 'academic': return renderAcademicBackground()
            case 'experience': return renderExperienceSkills()
            case 'finalize': return renderFinalize()
            default: return null
        }
    }

    const progress = ((currentStep + 1) / STEPS.length) * 100

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950">
            {/* Header with Progress */}
            <header className="sticky top-0 z-20 bg-white/95 dark:bg-dark-950/95 backdrop-blur-sm border-b border-light-200 dark:border-dark-700 px-4 py-3">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-light-primary dark:text-white">
                            Step {currentStep + 1} of {STEPS.length}
                        </span>
                        <button onClick={onBack} className="text-sm text-text-light-secondary hover:text-text-light-primary dark:text-gray-400 dark:hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="h-2 bg-light-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-3">
                        <h1 className="text-lg font-bold text-text-light-primary dark:text-white">{STEPS[currentStep].title}</h1>
                        <p className="text-sm text-text-light-secondary dark:text-gray-400">{STEPS[currentStep].subtitle}</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main ref={contentRef} className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-lg mx-auto">
                    <div
                        key={currentStep}
                        className={`animate-slide-${direction === 'next' ? 'left' : 'right'}`}
                    >
                        {renderStepContent()}
                    </div>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="sticky bottom-0 z-20 bg-white/95 dark:bg-dark-950/95 backdrop-blur-sm border-t border-light-200 dark:border-dark-700 px-4 py-3">
                <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${currentStep === 0
                            ? 'text-text-light-secondary/40 dark:text-gray-600 cursor-not-allowed'
                            : 'text-text-light-secondary dark:text-gray-400 hover:text-text-light-primary dark:hover:text-white hover:bg-light-100 dark:hover:bg-dark-800'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    {currentStep === STEPS.length - 1 ? (
                        generateState === 'preview' ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyText}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${copied
                                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                        : 'bg-light-100 dark:bg-dark-700 text-text-light-primary dark:text-white hover:bg-light-200 dark:hover:bg-dark-600'
                                        }`}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy Text'}
                                </button>
                                <PDFDownloadLink
                                    document={<ResumePDF data={formData} />}
                                    fileName={`${formData.fullName || 'Resume'}_CV.pdf`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                                >
                                    <Download className="w-4 h-4" /> Download PDF
                                </PDFDownloadLink>
                            </div>
                        ) : generateState === 'generating' ? (
                            <button
                                disabled
                                className="flex items-center gap-2 px-6 py-2.5 bg-light-200 dark:bg-dark-700 text-text-light-secondary dark:text-gray-500 rounded-xl font-medium cursor-not-allowed"
                            >
                                Enhancing & Generating...
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                            >
                                <Sparkles className="w-4 h-4" /> Generate
                            </button>
                        )
                    ) : (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </footer>
        </div>
    )
}
