import { useState, useRef, useEffect } from 'react'
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap, Building2, ChevronDown, Plus, Trash2, CheckSquare, Square
} from 'lucide-react'
import {
    JOB_TITLE_SUGGESTIONS, EXPERIENCE_LEVELS,
    COMMON_DEGREES, COMMON_MAJORS
} from '../data/jobRoleTemplates'

const YEARS = Array.from({ length: 15 }, (_, i) => 2026 - i)

// Standard education levels for Bangladesh context
const EDUCATION_TIERS = [
    { id: 'masters', label: "Master's / Post-Graduation", type: 'degree' },
    { id: 'bachelors', label: "Bachelor's / Honors", type: 'degree' },
    { id: 'hsc', label: 'HSC / A-Level / Diploma', type: 'school' },
    { id: 'ssc', label: 'SSC / O-Level', type: 'school' },
]

export default function QuickStartForm({ onSubmit, isLoading }) {
    const [formData, setFormData] = useState({
        // Personal (4 required)
        fullName: '',
        email: '',
        phone: '',
        location: '',

        // Career (2 required)
        targetJobTitle: '',
        experienceLevel: '',

        // Education (New structure)
        education: {}, // Will store objects keyed by tier id (e.g., 'bachelors': { ... })

        // Optional Experience (2 fields)
        currentCompany: '',
        currentPosition: '',
    })

    const [showJobSuggestions, setShowJobSuggestions] = useState(false)
    const [filteredJobs, setFilteredJobs] = useState([])
    const jobInputRef = useRef(null)

    // Update field helper
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Toggle education tier
    const toggleEducation = (tierId) => {
        setFormData(prev => {
            const current = { ...prev.education }
            if (current[tierId]) {
                delete current[tierId]
            } else {
                // Initialize empty fields for this tier
                current[tierId] = {
                    level: EDUCATION_TIERS.find(t => t.id === tierId).label,
                    degree: '',
                    major: '', // or Group for school
                    institution: '',
                    passingYear: '',
                    result: ''
                }
            }
            return { ...prev, education: current }
        })
    }

    // Update specific education field
    const updateEducationField = (tierId, field, value) => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [tierId]: { ...prev.education[tierId], [field]: value }
            }
        }))
    }

    // Job title autocomplete
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

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (jobInputRef.current && !jobInputRef.current.contains(e.target)) {
                setShowJobSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    // Validation
    const hasEducation = Object.keys(formData.education).length > 0
    const isValid = formData.fullName && formData.email && formData.targetJobTitle &&
        formData.experienceLevel && hasEducation

    const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
    const labelClass = "block text-sm font-medium text-text-light-primary dark:text-gray-300 mb-2"
    const sectionClass = "space-y-4"

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Info */}
            <div className={sectionClass}>
                <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                </h3>

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
                            required
                        />
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className={`${inputClass} pl-11`}
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Phone</label>
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
                            placeholder="Dhaka, Bangladesh"
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Career Goal */}
            <div className={sectionClass}>
                <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Career Goal
                </h3>

                {/* Target Job Title with Autocomplete */}
                <div ref={jobInputRef} className="relative">
                    <label className={labelClass}>Target Job Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={formData.targetJobTitle}
                        onChange={(e) => updateField('targetJobTitle', e.target.value)}
                        onFocus={() => setShowJobSuggestions(true)}
                        className={inputClass}
                        placeholder="e.g., Business Analyst, Software Engineer"
                        required
                    />
                    {showJobSuggestions && filteredJobs.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {filteredJobs.map((job, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        updateField('targetJobTitle', job)
                                        setShowJobSuggestions(false)
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-text-light-primary dark:text-white hover:bg-primary-500/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                >
                                    {job}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Experience Level */}
                <div>
                    <label className={labelClass}>Experience Level <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            value={formData.experienceLevel}
                            onChange={(e) => updateField('experienceLevel', e.target.value)}
                            className={`${inputClass} appearance-none cursor-pointer`}
                            required
                        >
                            <option value="">Select experience level</option>
                            {EXPERIENCE_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Section 3: Education Details */}
            <div className={sectionClass}>
                <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Education Details <span className="text-red-500">*</span>
                </h3>

                <div className="space-y-3">
                    <p className="text-sm text-text-light-secondary dark:text-gray-400 mb-2">Select all that apply:</p>

                    {EDUCATION_TIERS.map((tier) => {
                        const isSelected = !!formData.education[tier.id]
                        const data = formData.education[tier.id] || {}

                        return (
                            <div key={tier.id} className={`border rounded-xl transition-all ${isSelected
                                    ? 'border-primary-500 bg-primary-50/10 dark:bg-primary-500/5'
                                    : 'border-light-200 dark:border-dark-700 hover:border-light-300 dark:hover:border-dark-600'
                                }`}>
                                {/* Checkbox Header */}
                                <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'border-text-light-secondary/30 dark:border-gray-600 bg-white dark:bg-dark-800'
                                        }`}>
                                        {isSelected && <CheckSquare className="w-3.5 h-3.5 fill-current" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleEducation(tier.id)}
                                        className="hidden"
                                    />
                                    <span className={`font-medium ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-text-light-primary dark:text-gray-300'}`}>
                                        {tier.label}
                                    </span>
                                </label>

                                {/* Expanded Fields */}
                                {isSelected && (
                                    <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
                                        {/* Degree Name (for Bachelors/Masters) */}
                                        {tier.type === 'degree' && (
                                            <div>
                                                <label className={labelClass}>Degree Name</label>
                                                <input
                                                    type="text"
                                                    value={data.degree}
                                                    onChange={(e) => updateEducationField(tier.id, 'degree', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="e.g., BBA, BSc, MBA"
                                                    list="degree-suggestions"
                                                />
                                            </div>
                                        )}

                                        {/* Major / Group */}
                                        {tier.type === 'degree' ? (
                                            <div>
                                                <label className={labelClass}>Major / Subject</label>
                                                <input
                                                    type="text"
                                                    value={data.major}
                                                    onChange={(e) => updateEducationField(tier.id, 'major', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="e.g., Marketing, CS"
                                                    list="major-suggestions"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className={labelClass}>Group</label>
                                                <input
                                                    type="text"
                                                    value={data.major}
                                                    onChange={(e) => updateEducationField(tier.id, 'major', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="e.g., Science, Business Studies"
                                                />
                                            </div>
                                        )}

                                        {/* Institution */}
                                        <div className="sm:col-span-2">
                                            <label className={labelClass}>Institution Name</label>
                                            <input
                                                type="text"
                                                value={data.institution}
                                                onChange={(e) => updateEducationField(tier.id, 'institution', e.target.value)}
                                                className={inputClass}
                                                placeholder="School / College / University"
                                            />
                                        </div>

                                        {/* Passing Year */}
                                        <div>
                                            <label className={labelClass}>Passing Year</label>
                                            <div className="relative">
                                                <select
                                                    value={data.passingYear}
                                                    onChange={(e) => updateEducationField(tier.id, 'passingYear', e.target.value)}
                                                    className={`${inputClass} appearance-none cursor-pointer`}
                                                >
                                                    <option value="">Year</option>
                                                    {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Result (Optional) */}
                                        <div>
                                            <label className={labelClass}>Result / GPA</label>
                                            <input
                                                type="text"
                                                value={data.result}
                                                onChange={(e) => updateEducationField(tier.id, 'result', e.target.value)}
                                                className={inputClass}
                                                placeholder="e.g., 5.00, 3.75"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Datalists for suggestions */}
                    <datalist id="degree-suggestions">
                        {COMMON_DEGREES.map(deg => <option key={deg} value={deg} />)}
                    </datalist>
                    <datalist id="major-suggestions">
                        {COMMON_MAJORS.map(major => <option key={major} value={major} />)}
                    </datalist>
                </div>
            </div>

            {/* Section 4: Current Job (Optional) */}
            <div className={sectionClass}>
                <h3 className="text-sm font-semibold text-text-light-secondary dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Current / Recent Job <span className="font-normal text-xs">(Optional)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Company</label>
                        <input
                            type="text"
                            value={formData.currentCompany}
                            onChange={(e) => updateField('currentCompany', e.target.value)}
                            className={inputClass}
                            placeholder="Company name (if any)"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Position</label>
                        <input
                            type="text"
                            value={formData.currentPosition}
                            onChange={(e) => updateField('currentPosition', e.target.value)}
                            className={inputClass}
                            placeholder="Your role (if any)"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isValid && !isLoading
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/25'
                        : 'bg-light-300 dark:bg-dark-700 text-text-light-secondary dark:text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isLoading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Generating Your Resume...
                    </>
                ) : (
                    <>Generate Resume with AI ✨</>
                )}
            </button>
        </form>
    )
}
