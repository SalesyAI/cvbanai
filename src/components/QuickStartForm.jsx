import { useState, useRef, useEffect } from 'react'
import {
    User, Mail, Phone, MapPin, Briefcase, GraduationCap, Building2, ChevronDown
} from 'lucide-react'
import {
    JOB_TITLE_SUGGESTIONS, EXPERIENCE_LEVELS, EDUCATION_LEVELS,
    COMMON_DEGREES, COMMON_MAJORS
} from '../data/jobRoleTemplates'

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i)

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

        // Education (5 fields)
        highestEducation: '',
        degree: '',
        major: '',
        institution: '',
        passingYear: '',

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
    const isValid = formData.fullName && formData.email && formData.targetJobTitle &&
        formData.experienceLevel && formData.highestEducation

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

            {/* Section 3: Education */}
            <div className={sectionClass}>
                <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Education
                </h3>

                {/* Education Level */}
                <div>
                    <label className={labelClass}>Highest Education <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select
                            value={formData.highestEducation}
                            onChange={(e) => updateField('highestEducation', e.target.value)}
                            className={`${inputClass} appearance-none cursor-pointer`}
                            required
                        >
                            <option value="">Select education level</option>
                            {EDUCATION_LEVELS.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Degree & Major */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Degree</label>
                        <input
                            type="text"
                            value={formData.degree}
                            onChange={(e) => updateField('degree', e.target.value)}
                            className={inputClass}
                            placeholder="e.g., BBA, BSc, MBA"
                            list="degree-suggestions"
                        />
                        <datalist id="degree-suggestions">
                            {COMMON_DEGREES.map(deg => <option key={deg} value={deg} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className={labelClass}>Major / Field</label>
                        <input
                            type="text"
                            value={formData.major}
                            onChange={(e) => updateField('major', e.target.value)}
                            className={inputClass}
                            placeholder="e.g., Marketing, Computer Science"
                            list="major-suggestions"
                        />
                        <datalist id="major-suggestions">
                            {COMMON_MAJORS.map(major => <option key={major} value={major} />)}
                        </datalist>
                    </div>
                </div>

                {/* Institution & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Institution</label>
                        <input
                            type="text"
                            value={formData.institution}
                            onChange={(e) => updateField('institution', e.target.value)}
                            className={inputClass}
                            placeholder="University / College name"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Passing Year</label>
                        <div className="relative">
                            <select
                                value={formData.passingYear}
                                onChange={(e) => updateField('passingYear', e.target.value)}
                                className={`${inputClass} appearance-none cursor-pointer`}
                            >
                                <option value="">Select year</option>
                                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary/50 dark:text-gray-500 pointer-events-none" />
                        </div>
                    </div>
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
