import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap, Building2,
    ChevronRight, ChevronLeft, Search, CheckSquare
} from 'lucide-react'
import {
    JOB_TITLE_SUGGESTIONS, EXPERIENCE_LEVELS,
    COMMON_MAJORS, BACHELOR_DEGREES, MASTER_DEGREES
} from '../data/jobRoleTemplates'

const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i)

const EDUCATION_TIERS = [
    { id: 'masters', label: "Master's / Post-Graduation", type: 'degree' },
    { id: 'bachelors', label: "Bachelor's / Honors", type: 'degree' },
    { id: 'hsc', label: 'HSC / A-Level / Diploma', type: 'school' },
    { id: 'ssc', label: 'SSC / O-Level', type: 'school' },
]

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.4, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
}

export default function QuickStartForm({ onSubmit, isLoading }) {
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', location: '',
        targetJobTitle: '', experienceLevel: '',
        education: {},
        currentCompany: '', currentPosition: '',
    })

    const [showJobSuggestions, setShowJobSuggestions] = useState(false)
    const [filteredJobs, setFilteredJobs] = useState([])
    const jobInputRef = useRef(null)

    // Helper: Update field
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Helper: Toggle education
    const toggleEducation = (tierId) => {
        setFormData(prev => {
            const current = { ...prev.education }
            if (current[tierId]) {
                delete current[tierId]
            } else {
                current[tierId] = {
                    level: EDUCATION_TIERS.find(t => t.id === tierId).label,
                    degree: '', major: '', institution: '', passingYear: '', result: ''
                }
            }
            return { ...prev, education: current }
        })
    }

    // Helper: Update education detail
    const updateEducationField = (tierId, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [tierId]: { ...prev.education[tierId], [field]: value }
            }
        }))
    }

    // Job Autocomplete logic
    useEffect(() => {
        if (formData.targetJobTitle.length > 0) {
            const filtered = JOB_TITLE_SUGGESTIONS.filter(job =>
                job.toLowerCase().includes(formData.targetJobTitle.toLowerCase())
            ).slice(0, 6)
            setFilteredJobs(filtered)
        } else {
            setFilteredJobs(JOB_TITLE_SUGGESTIONS.slice(0, 6))
        }
    }, [formData.targetJobTitle])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (jobInputRef.current && !jobInputRef.current.contains(e.target)) {
                setShowJobSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 0))
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    // Validation
    const isStepValid = () => {
        switch (step) {
            case 0: return formData.fullName && formData.email
            case 1: return formData.targetJobTitle && formData.experienceLevel
            case 2: return Object.keys(formData.education).length > 0
            case 3: return true
            default: return false
        }
    }

    // Loading scanning animation
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <div className="mb-12">
                    <div className="loader">
                        <span>Generating Resume</span>
                    </div>
                </div>
                <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto"
                >
                    Analyzing your profile and crafting professional content...
                </motion.p>
            </div>
        )
    }

    // Styles - note text-base for mobile inputs prevents iOS auto-zoom
    const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-base"
    const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"

    return (
        <form onSubmit={handleSubmit} className="relative min-h-[400px]">
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-8 px-2">
                {['Basic Info', 'Career Goal', 'Education', 'Status'].map((label, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 ${i <= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                        <motion.div
                            initial={false}
                            animate={{
                                scale: i === step ? 1.2 : 1,
                                backgroundColor: i === step ? '#4f46e5' : i < step ? '#e0e7ff' : '#f3f4f6',
                                color: i === step ? '#ffffff' : i < step ? '#4338ca' : '#9ca3af'
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'dark:bg-primary-900/30 dark:text-primary-400' : 'dark:bg-dark-800'
                                }`}
                        >
                            {i < step ? '✓' : i + 1}
                        </motion.div>
                        <span className="text-xs font-medium hidden sm:block">{label}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mb-8"
                >
                    {step === 0 && (
                        <div className="space-y-5">
                            <motion.div variants={itemVariants} className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Let's start with the basics</h2>
                                <p className="text-gray-500">We'll use this to personalize your resume.</p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => updateField('fullName', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="John Doe"
                                        autoFocus
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <motion.div variants={itemVariants}>
                                    <label className={labelClass}>Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                            placeholder="+880 17..."
                                        />
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label className={labelClass}>Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => updateField('location', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                            placeholder="Dhaka, Bangladesh"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <motion.div variants={itemVariants} className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's your goal?</h2>
                                <p className="text-gray-500">This helps us tailor the content for you.</p>
                            </motion.div>

                            <motion.div variants={itemVariants} ref={jobInputRef} className="relative">
                                <label className={labelClass}>Target Job Title <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.targetJobTitle}
                                        onChange={(e) => updateField('targetJobTitle', e.target.value)}
                                        onFocus={() => setShowJobSuggestions(true)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="e.g. Software Engineer"
                                        autoFocus
                                    />
                                </div>

                                {showJobSuggestions && filteredJobs.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden"
                                    >
                                        {filteredJobs.map((job, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => {
                                                    updateField('targetJobTitle', job)
                                                    setShowJobSuggestions(false)
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 text-sm transition-colors border-b last:border-0 border-gray-50 dark:border-dark-700"
                                            >
                                                {job}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClass}>Experience Level <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.experienceLevel}
                                    onChange={(e) => updateField('experienceLevel', e.target.value)}
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                >
                                    <option value="">Select your level...</option>
                                    {EXPERIENCE_LEVELS.map(level => (
                                        <option key={level.value} value={level.value}>{level.label}</option>
                                    ))}
                                </select>
                            </motion.div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <motion.div variants={itemVariants} className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education History</h2>
                                <p className="text-gray-500">Select all that apply.</p>
                            </motion.div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {EDUCATION_TIERS.map((tier) => {
                                    const isSelected = !!formData.education[tier.id]
                                    const data = formData.education[tier.id] || {}

                                    return (
                                        <motion.div
                                            key={tier.id}
                                            variants={itemVariants}
                                            className={`border transition-all ${isSelected
                                                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-sm'
                                                : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                                                } rounded-xl overflow-hidden`}
                                        >
                                            <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleEducation(tier.id)}
                                                    className="hidden"
                                                />
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-primary-600 border-primary-600'
                                                    : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-gray-500'
                                                    }`}>
                                                    {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                                                </div>
                                                <span className={`font-semibold ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {tier.label}
                                                </span>
                                            </label>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="px-4 pb-4 pt-0 grid grid-cols-1 gap-3"
                                                >
                                                    {tier.type === 'degree' && (
                                                        <input
                                                            type="text"
                                                            value={data.degree}
                                                            onChange={(e) => updateEducationField(tier.id, 'degree', e.target.value)}
                                                            className={inputClass}
                                                            placeholder="Degree Name (e.g. BBA)"
                                                            list={tier.id === 'masters' ? 'master-degrees' : tier.id === 'bachelors' ? 'bachelor-degrees' : 'degree-suggestions'}
                                                        />
                                                    )}

                                                    <input
                                                        type="text"
                                                        value={data.major}
                                                        onChange={(e) => updateEducationField(tier.id, 'major', e.target.value)}
                                                        className={inputClass}
                                                        placeholder={tier.type === 'degree' ? "Major / Subject" : "Group (e.g. Science)"}
                                                        list="major-suggestions"
                                                    />

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            value={data.institution}
                                                            onChange={(e) => updateEducationField(tier.id, 'institution', e.target.value)}
                                                            className={inputClass}
                                                            placeholder="Institution"
                                                        />
                                                        <select
                                                            value={data.passingYear}
                                                            onChange={(e) => updateEducationField(tier.id, 'passingYear', e.target.value)}
                                                            className={`${inputClass} appearance-none cursor-pointer`}
                                                        >
                                                            <option value="">Year</option>
                                                            {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                                        </select>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={data.result}
                                                        onChange={(e) => updateEducationField(tier.id, 'result', e.target.value)}
                                                        className={inputClass}
                                                        placeholder="Result / GPA"
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                            {/* Datalists */}
                            <datalist id="bachelor-degrees">{BACHELOR_DEGREES.map(d => <option key={d} value={d} />)}</datalist>
                            <datalist id="master-degrees">{MASTER_DEGREES.map(d => <option key={d} value={d} />)}</datalist>
                            <datalist id="major-suggestions">{COMMON_MAJORS.map(m => <option key={m} value={m} />)}</datalist>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <motion.div variants={itemVariants} className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Status</h2>
                                <p className="text-gray-500">Optional details about your current role.</p>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClass}>Company Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.currentCompany}
                                        onChange={(e) => updateField('currentCompany', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="Currently working at..."
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className={labelClass}>Position</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.currentPosition}
                                        onChange={(e) => updateField('currentPosition', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                        placeholder="Your job title..."
                                    />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-dark-700">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 0}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${step === 0
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-700 active:scale-95'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>

                {step === 3 ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all"
                    >
                        Generate Resume
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${isStepValid()
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:shadow-lg'
                            : 'bg-gray-200 dark:bg-dark-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Next Step <ChevronRight className="w-4 h-4" />
                    </motion.button>
                )}
            </div>
        </form>
    )
}
