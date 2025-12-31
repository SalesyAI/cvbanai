import { useState } from 'react'
import { X, ArrowLeft, ArrowRight, Plus, Trash2, User, Mail, FileText, Briefcase, GraduationCap, Wrench } from 'lucide-react'

const STEPS = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'contact', title: 'Contact', icon: Mail },
    { id: 'summary', title: 'Summary', icon: FileText },
    { id: 'work', title: 'Work History', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Wrench },
]

export default function MultiStepModal({ onComplete, onClose }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
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

    const renderStepContent = () => {
        switch (STEPS[currentStep].id) {
            case 'personal':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => updateField('fullName', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => updateField('location', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                placeholder="San Francisco, CA"
                            />
                        </div>
                    </div>
                )

            case 'contact':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                placeholder="john.doe@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                )

            case 'summary':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
                            <textarea
                                value={formData.summary}
                                onChange={(e) => updateField('summary', e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500 resize-none"
                                placeholder="Briefly describe your professional background, key skills, and career objectives..."
                            />
                            <p className="mt-2 text-sm text-gray-500">Don't worry about perfection - our AI will enhance this!</p>
                        </div>
                    </div>
                )

            case 'work':
                return (
                    <div className="space-y-6">
                        {formData.workHistory.map((job, index) => (
                            <div key={index} className="p-6 bg-dark-800/50 rounded-xl border border-dark-700 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-300">Position {index + 1}</h4>
                                    {formData.workHistory.length > 1 && (
                                        <button
                                            onClick={() => removeWorkHistory(index)}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={job.company}
                                        onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Company name"
                                    />
                                    <input
                                        type="text"
                                        value={job.position}
                                        onChange={(e) => updateWorkHistory(index, 'position', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Job title"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={job.startDate}
                                        onChange={(e) => updateWorkHistory(index, 'startDate', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Start date (e.g., Jan 2020)"
                                    />
                                    <input
                                        type="text"
                                        value={job.endDate}
                                        onChange={(e) => updateWorkHistory(index, 'endDate', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="End date or Present"
                                    />
                                </div>
                                <textarea
                                    value={job.description}
                                    onChange={(e) => updateWorkHistory(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500 resize-none"
                                    placeholder="Describe your responsibilities and achievements..."
                                />
                            </div>
                        ))}
                        <button
                            onClick={addWorkHistory}
                            className="w-full py-3 border-2 border-dashed border-dark-700 rounded-xl text-gray-400 hover:text-white hover:border-primary-500 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Another Position
                        </button>
                    </div>
                )

            case 'education':
                return (
                    <div className="space-y-6">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="p-6 bg-dark-800/50 rounded-xl border border-dark-700 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-300">Education {index + 1}</h4>
                                    {formData.education.length > 1 && (
                                        <button
                                            onClick={() => removeEducation(index)}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Institution name"
                                    />
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Degree (e.g., Bachelor's)"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={edu.field}
                                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Field of study"
                                    />
                                    <input
                                        type="text"
                                        value={edu.graduationYear}
                                        onChange={(e) => updateEducation(index, 'graduationYear', e.target.value)}
                                        className="px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                        placeholder="Graduation year"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="w-full py-3 border-2 border-dashed border-dark-700 rounded-xl text-gray-400 hover:text-white hover:border-primary-500 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Another Education
                        </button>
                    </div>
                )

            case 'skills':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Add Skills</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-500"
                                    placeholder="Type a skill and press Enter"
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 text-primary-300 rounded-full"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        {formData.skills.length === 0 && (
                            <p className="text-sm text-gray-500">Add your technical and soft skills (e.g., JavaScript, Project Management, Communication)</p>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl glass-dark rounded-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-700">
                    <div>
                        <h2 className="text-xl font-bold">Build Your Resume</h2>
                        <p className="text-sm text-gray-400 mt-1">Step {currentStep + 1} of {STEPS.length}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 border-b border-dark-700">
                    <div className="flex items-center justify-between mb-3">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-2 ${index <= currentStep ? 'text-primary-400' : 'text-gray-600'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < currentStep
                                            ? 'bg-primary-500 text-white'
                                            : index === currentStep
                                                ? 'bg-primary-500/20 border-2 border-primary-500'
                                                : 'bg-dark-700'
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium hidden sm:inline">{step.title}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-6">{STEPS[currentStep].title}</h3>
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-dark-700">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 0
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-300 hover:text-white hover:bg-dark-700'
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <button
                        onClick={nextStep}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-medium text-white transition-all glow-violet"
                    >
                        {currentStep === STEPS.length - 1 ? 'Generate Resume' : 'Next'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
