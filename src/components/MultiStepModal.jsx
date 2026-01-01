import { useState } from 'react'
import { X, ArrowLeft, ArrowRight, Plus, Trash2, Sparkles, CheckCircle } from 'lucide-react'
import Logo from './Logo'

const STEPS = [
    {
        id: 'basics',
        title: 'Let\'s start with the basics',
        subtitle: 'Tell us about yourself'
    },
    {
        id: 'experience',
        title: 'Your work experience',
        subtitle: 'Share your professional journey'
    },
    {
        id: 'education',
        title: 'Your education',
        subtitle: 'Academic background (optional)'
    },
    {
        id: 'skills',
        title: 'Your skills & strengths',
        subtitle: 'What are you great at?'
    },
]

export default function MultiStepModal({ onComplete, onClose, initialData }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState(initialData || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        workHistory: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
        education: [{ institution: '', degree: '', field: '', graduationYear: '' }],
        skills: [],
    })
    const [skillInput, setSkillInput] = useState('')

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const updateWorkHistory = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            workHistory: prev.workHistory.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addWorkHistory = () => {
        setFormData(prev => ({
            ...prev,
            workHistory: [...prev.workHistory, { company: '', position: '', startDate: '', endDate: '', description: '' }]
        }))
    }

    const removeWorkHistory = (index) => {
        if (formData.workHistory.length > 1) {
            setFormData(prev => ({
                ...prev,
                workHistory: prev.workHistory.filter((_, i) => i !== index)
            }))
        }
    }

    const updateEducation = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', field: '', graduationYear: '' }]
        }))
    }

    const removeEducation = (index) => {
        if (formData.education.length > 1) {
            setFormData(prev => ({
                ...prev,
                education: prev.education.filter((_, i) => i !== index)
            }))
        }
    }

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }))
            setSkillInput('')
        }
    }

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSkill()
        }
    }

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            onComplete(formData)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const canProceed = () => {
        switch (STEPS[currentStep].id) {
            case 'basics':
                return formData.fullName.trim() && formData.email.trim()
            case 'experience':
                return formData.workHistory[0].position.trim() || formData.summary.trim()
            default:
                return true
        }
    }

    // Quick skill suggestions
    const skillSuggestions = [
        'Microsoft Office', 'Communication', 'Problem Solving', 'Teamwork',
        'Leadership', 'Time Management', 'Customer Service', 'Data Analysis'
    ]

    const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20"
    const labelClass = "block text-sm font-medium text-text-light-primary dark:text-gray-300 mb-2"

    const renderStepContent = () => {
        switch (STEPS[currentStep].id) {
            case 'basics':
                return (
                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                    className={inputClass}
                                    placeholder="Your full name"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className={inputClass}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className={inputClass}
                                    placeholder="+880 1XXX-XXXXXX"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    className={inputClass}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>
                                Brief Summary
                                <span className="text-text-light-secondary dark:text-gray-500 font-normal ml-2">(Our AI will enhance this)</span>
                            </label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                                rows={3}
                                className={`${inputClass} resize-none`}
                                placeholder="A quick overview of your professional background and goals..."
                            />
                        </div>
                    </div>
                )

            case 'experience':
                return (
                    <div className="space-y-5">
                        {formData.workHistory.map((job, index) => (
                            <div key={index} className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-primary-500 dark:text-primary-400">
                                        Experience #{index + 1}
                                    </span>
                                    {formData.workHistory.length > 1 && (
                                        <button
                                            onClick={() => removeWorkHistory(index)}
                                            className="p-1.5 text-text-light-secondary hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={job.position}
                                        onChange={(e) => updateWorkHistory(index, 'position', e.target.value)}
                                        className={inputClass}
                                        placeholder="Job Title"
                                    />
                                    <input
                                        type="text"
                                        value={job.company}
                                        onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                                        className={inputClass}
                                        placeholder="Company Name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={job.startDate}
                                        onChange={(e) => updateWorkHistory(index, 'startDate', e.target.value)}
                                        className={inputClass}
                                        placeholder="Start (Jan 2022)"
                                    />
                                    <input
                                        type="text"
                                        value={job.endDate}
                                        onChange={(e) => updateWorkHistory(index, 'endDate', e.target.value)}
                                        className={inputClass}
                                        placeholder="End (Present)"
                                    />
                                </div>
                                <textarea
                                    value={job.description}
                                    onChange={(e) => updateWorkHistory(index, 'description', e.target.value)}
                                    rows={2}
                                    className={`${inputClass} resize-none`}
                                    placeholder="What did you do? Key achievements?"
                                />
                            </div>
                        ))}
                        <button
                            onClick={addWorkHistory}
                            className="w-full py-3 border-2 border-dashed border-light-200 dark:border-dark-700 rounded-xl text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-400 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Job
                        </button>
                    </div>
                )

            case 'education':
                return (
                    <div className="space-y-5">
                        <p className="text-sm text-text-light-secondary dark:text-gray-400 -mt-2 mb-4">
                            You can skip this if not relevant to your field.
                        </p>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="p-4 bg-light-100 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-primary-500 dark:text-primary-400">
                                        Education #{index + 1}
                                    </span>
                                    {formData.education.length > 1 && (
                                        <button
                                            onClick={() => removeEducation(index)}
                                            className="p-1.5 text-text-light-secondary hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                        className={inputClass}
                                        placeholder="School / University"
                                    />
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        className={inputClass}
                                        placeholder="Degree (BSc, MBA...)"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={edu.field}
                                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                        className={inputClass}
                                        placeholder="Field of Study"
                                    />
                                    <input
                                        type="text"
                                        value={edu.graduationYear}
                                        onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                                        className={inputClass}
                                        placeholder="Year (2022)"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="w-full py-3 border-2 border-dashed border-light-200 dark:border-dark-700 rounded-xl text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:border-primary-500 dark:hover:border-primary-400 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another
                        </button>
                    </div>
                )

            case 'skills':
                return (
                    <div className="space-y-5">
                        <div>
                            <label className={labelClass}>Add Your Skills</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={`flex-1 ${inputClass}`}
                                    placeholder="Type a skill and press Enter"
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-5 py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Added skills */}
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 dark:bg-primary-400/20 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Quick add suggestions */}
                        <div>
                            <p className="text-sm text-text-light-secondary dark:text-gray-500 mb-2">Quick add:</p>
                            <div className="flex flex-wrap gap-2">
                                {skillSuggestions.filter(s => !formData.skills.includes(s)).slice(0, 5).map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))}
                                        className="px-3 py-1.5 bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 text-text-light-secondary dark:text-gray-400 rounded-full text-sm transition-colors"
                                    >
                                        + {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animated-bg">
            {/* Modal */}
            <div className="relative w-full max-w-xl bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-light-200 dark:border-dark-700">
                    <Logo className="h-7" textColor="text-text-light-primary dark:text-white" />
                    <button
                        onClick={onClose}
                        className="p-2 text-text-light-secondary dark:text-gray-400 hover:text-text-light-primary dark:hover:text-white rounded-lg hover:bg-light-100 dark:hover:bg-dark-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress */}
                <div className="px-5 py-4 border-b border-light-200 dark:border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${index < currentStep
                                    ? 'bg-primary-500 text-white'
                                    : index === currentStep
                                        ? 'bg-primary-500/20 text-primary-500 dark:text-primary-400 ring-2 ring-primary-500'
                                        : 'bg-light-100 dark:bg-dark-700 text-text-light-secondary dark:text-gray-500'
                                    }`}>
                                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-8 sm:w-16 h-0.5 mx-1 ${index < currentStep ? 'bg-primary-500' : 'bg-light-200 dark:bg-dark-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-text-light-primary dark:text-white">
                            {STEPS[currentStep].title}
                        </h2>
                        <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-1">
                            {STEPS[currentStep].subtitle}
                        </p>
                    </div>

                    <div className="max-h-[45vh] overflow-y-auto pr-1">
                        {renderStepContent()}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-light-200 dark:border-dark-700 bg-light-50 dark:bg-dark-800/50">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${currentStep === 0
                            ? 'text-text-light-secondary/50 dark:text-gray-600 cursor-not-allowed'
                            : 'text-text-light-secondary dark:text-gray-400 hover:text-text-light-primary dark:hover:text-white hover:bg-light-100 dark:hover:bg-dark-700'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${canProceed()
                            ? 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white'
                            : 'bg-light-200 dark:bg-dark-700 text-text-light-secondary dark:text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {currentStep === STEPS.length - 1 ? (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Resume
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
