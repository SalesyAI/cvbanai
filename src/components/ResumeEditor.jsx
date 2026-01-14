import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown, ChevronUp, Edit3, RefreshCw, Plus, Trash2, Check, X,
    User, Briefcase, GraduationCap, Wrench, Award, Languages, Users, FileText, Camera
} from 'lucide-react'

// Mobile-optimized inputs (text-base prevents iOS zoom)
const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl text-base text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all custom-active-ring"

/**
 * Collapsible Section Card with Framer Motion
 */
function SectionCard({ title, icon: Icon, children, isOpen, onToggle, onRegenerate, regenerating }) {
    return (
        <motion.div
            layout
            initial={false}
            className="border border-light-200 dark:border-dark-700 rounded-xl overflow-hidden bg-white dark:bg-dark-900 shadow-sm"
        >
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-primary-50/50 dark:bg-dark-800' : 'hover:bg-light-50 dark:hover:bg-dark-800'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-light-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-text-light-primary dark:text-white text-lg">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {onRegenerate && (
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRegenerate()
                            }}
                            disabled={regenerating}
                            className="p-2 text-text-light-secondary hover:text-primary-500 transition-colors rounded-full hover:bg-light-100 dark:hover:bg-dark-700"
                            title="Regenerate this section"
                        >
                            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                        </motion.button>
                    )}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-4 pt-0 space-y-4 border-t border-light-100 dark:border-dark-800 mt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Category color classes for visual distinction
const CATEGORY_COLORS = [
    'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800',
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
]

export default function ResumeEditor({ resumeData, onUpdate, onRegenerate }) {
    const [openSections, setOpenSections] = useState(['summary', 'skills'])
    const [regenerating, setRegenerating] = useState(null)
    const [editingCategory, setEditingCategory] = useState(null)
    const [skillInputs, setSkillInputs] = useState({})
    const [newCategoryName, setNewCategoryName] = useState('')

    const toggleSection = (section) => {
        setOpenSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        )
    }

    const handleFieldChange = (field, value) => {
        onUpdate({ ...resumeData, [field]: value })
    }

    // Experience helpers
    const updateExperience = (index, field, value) => {
        const updated = [...resumeData.experience]
        updated[index] = { ...updated[index], [field]: value }
        handleFieldChange('experience', updated)
    }

    const addExperience = () => {
        handleFieldChange('experience', [
            ...resumeData.experience,
            { position: '', company: '', startDate: '', endDate: '', description: '' }
        ])
    }

    const removeExperience = (index) => {
        if (resumeData.experience.length > 1) {
            handleFieldChange('experience', resumeData.experience.filter((_, i) => i !== index))
        }
    }

    // Skill Category helpers
    const updateSkillCategory = (catIndex, field, value) => {
        const updated = [...(resumeData.skillCategories || [])]
        updated[catIndex] = { ...updated[catIndex], [field]: value }
        handleFieldChange('skillCategories', updated)
    }

    const handleSkillInputChange = (catIndex, value) => {
        setSkillInputs(prev => ({ ...prev, [catIndex]: value }))
    }

    const addSkillToCategory = (catIndex) => {
        const skill = skillInputs[catIndex]
        if (!skill?.trim()) return

        const updated = [...(resumeData.skillCategories || [])]
        const existingSkills = updated[catIndex].skills || []

        if (!existingSkills.includes(skill.trim())) {
            updated[catIndex] = { ...updated[catIndex], skills: [...existingSkills, skill.trim()] }
            handleFieldChange('skillCategories', updated)
        }

        // Clear input for this category
        setSkillInputs(prev => ({ ...prev, [catIndex]: '' }))
    }

    const removeSkillFromCategory = (catIndex, skill) => {
        const updated = [...(resumeData.skillCategories || [])]
        updated[catIndex] = {
            ...updated[catIndex],
            skills: updated[catIndex].skills.filter(s => s !== skill)
        }
        handleFieldChange('skillCategories', updated)
    }

    const addNewCategory = () => {
        if (!newCategoryName.trim()) return
        const updated = [...(resumeData.skillCategories || []), { category: newCategoryName.trim(), skills: [] }]
        handleFieldChange('skillCategories', updated)
        setNewCategoryName('')
    }

    const removeCategory = (catIndex) => {
        if ((resumeData.skillCategories?.length || 0) > 1) {
            handleFieldChange('skillCategories', resumeData.skillCategories.filter((_, i) => i !== catIndex))
        }
    }

    // Extra-curricular helpers
    const updateActivity = (index, field, value) => {
        const updated = [...resumeData.extraCurricular]
        updated[index] = { ...updated[index], [field]: value }
        handleFieldChange('extraCurricular', updated)
    }

    const addActivity = () => {
        handleFieldChange('extraCurricular', [
            ...resumeData.extraCurricular,
            { activity: '', duration: '', role: '', impact: '' }
        ])
    }

    const removeActivity = (index) => {
        if (resumeData.extraCurricular.length > 1) {
            handleFieldChange('extraCurricular', resumeData.extraCurricular.filter((_, i) => i !== index))
        }
    }

    // Language helpers
    const updateLanguage = (index, field, value) => {
        const updated = [...resumeData.languages]
        updated[index] = { ...updated[index], [field]: value }
        handleFieldChange('languages', updated)
    }

    const addLanguage = () => {
        handleFieldChange('languages', [...resumeData.languages, { name: '', proficiency: 'Professional' }])
    }

    const removeLanguage = (index) => {
        if (resumeData.languages.length > 1) {
            handleFieldChange('languages', resumeData.languages.filter((_, i) => i !== index))
        }
    }

    // Photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                handleFieldChange('profilePhoto', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRegenerate = async (section) => {
        setRegenerating(section)
        try {
            await onRegenerate?.(section)
        } finally {
            setRegenerating(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Header with Photo */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-white dark:bg-dark-800 rounded-2xl border border-light-200 dark:border-dark-700 shadow-sm">
                {/* Photo Upload */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-light-100 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-dark-800 ring-1 ring-light-200 dark:ring-dark-600 shadow-lg">
                        {resumeData.profilePhoto ? (
                            <img src={resumeData.profilePhoto} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transform transition-transform hover:scale-110">
                        <Camera className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {resumeData.fullName}
                    </h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                        {[resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).map((item, i) => (
                            <span key={i} className="flex items-center gap-2">
                                {i > 0 && <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 hidden sm:block" />}
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-xs font-semibold text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50">
                        {resumeData._targetJobTitle} • {resumeData._experienceLevel}
                    </div>
                </div>
            </div>

            {/* Career Objective / Summary */}
            <SectionCard
                title="Career Objective"
                icon={FileText}
                isOpen={openSections.includes('summary')}
                onToggle={() => toggleSection('summary')}
                onRegenerate={() => handleRegenerate('summary')}
                regenerating={regenerating === 'summary'}
            >
                <textarea
                    value={resumeData.careerObjective || ''}
                    onChange={(e) => handleFieldChange('careerObjective', e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your professional goals..."
                />
            </SectionCard>

            {/* Experience */}
            <SectionCard
                title="Work Experience"
                icon={Briefcase}
                isOpen={openSections.includes('experience')}
                onToggle={() => toggleSection('experience')}
            >
                <div className="space-y-4">
                    <AnimatePresence>
                        {resumeData.experience?.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700/50 group hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Position {index + 1}</span>
                                    {resumeData.experience.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                        className={inputClass}
                                        placeholder="Start Date"
                                    />
                                    <input
                                        type="text"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                        className={inputClass}
                                        placeholder="End Date"
                                    />
                                </div>
                                <textarea
                                    value={exp.description || ''}
                                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                    rows={3}
                                    className={`${inputClass} resize-none text-sm`}
                                    placeholder="Describe your responsibilities..."
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={addExperience}
                    className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2 font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Experience
                </motion.button>
            </SectionCard>

            {/* Categorized Skills */}
            <SectionCard
                title="Skills"
                icon={Wrench}
                isOpen={openSections.includes('skills')}
                onToggle={() => toggleSection('skills')}
                onRegenerate={() => handleRegenerate('skills')}
                regenerating={regenerating === 'skills'}
            >
                <div className="space-y-4">
                    {resumeData.skillCategories?.map((cat, catIndex) => {
                        const colorClass = CATEGORY_COLORS[catIndex % CATEGORY_COLORS.length]
                        return (
                            <motion.div
                                key={catIndex}
                                layout
                                className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700/50"
                            >
                                {/* Category Header */}
                                <div className="flex items-center justify-between mb-3">
                                    {editingCategory === catIndex ? (
                                        <input
                                            type="text"
                                            value={cat.category}
                                            onChange={(e) => updateSkillCategory(catIndex, 'category', e.target.value)}
                                            onBlur={() => setEditingCategory(null)}
                                            onKeyPress={(e) => e.key === 'Enter' && setEditingCategory(null)}
                                            className="text-sm font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-primary-500 focus:outline-none pb-1"
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-500 transition-colors"
                                            onClick={() => setEditingCategory(catIndex)}
                                        >
                                            {cat.category}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setEditingCategory(catIndex)}
                                            className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-white dark:hover:bg-dark-700 transition-colors"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        {(resumeData.skillCategories?.length || 0) > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(catIndex)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-dark-700 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Skills in Category */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <AnimatePresence>
                                        {cat.skills?.map((skill, skillIndex) => (
                                            <motion.span
                                                key={skill}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${colorClass} bg-opacity-10`}
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkillFromCategory(catIndex, skill)}
                                                    className="hover:text-red-600 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Add Skill to Category */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skillInputs[catIndex] || ''}
                                        onChange={(e) => handleSkillInputChange(catIndex, e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addSkillToCategory(catIndex)
                                            }
                                        }}
                                        className={`flex-1 text-sm ${inputClass} py-2.5`}
                                        placeholder={`Add skill...`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addSkillToCategory(catIndex)}
                                        className="px-4 py-2 bg-white dark:bg-dark-700 border border-light-300 dark:border-dark-600 hover:border-primary-500 dark:hover:border-primary-500 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-all shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}

                    {/* Add New Category */}
                    <motion.div layout className="flex gap-2 pt-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewCategory())}
                            className={`flex-1 ${inputClass} py-2.5`}
                            placeholder="New category name..."
                        />
                        <button
                            type="button"
                            onClick={addNewCategory}
                            className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-100 transition-all font-medium whitespace-nowrap"
                        >
                            + New Category
                        </button>
                    </motion.div>
                </div>
            </SectionCard>

            {/* Extra-Curricular */}
            <SectionCard
                title="Extra-Curricular"
                icon={Award}
                isOpen={openSections.includes('activities')}
                onToggle={() => toggleSection('activities')}
            >
                <div className="space-y-4">
                    {resumeData.extraCurricular?.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-gray-400">ACTIVITY #{index + 1}</span>
                                {resumeData.extraCurricular.length > 1 && (
                                    <button onClick={() => removeActivity(index)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={item.activity}
                                    onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                                    className={inputClass}
                                    placeholder="Activity Name"
                                />
                                <input
                                    type="text"
                                    value={item.duration}
                                    onChange={(e) => updateActivity(index, 'duration', e.target.value)}
                                    className={inputClass}
                                    placeholder="Duration"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    value={item.role}
                                    onChange={(e) => updateActivity(index, 'role', e.target.value)}
                                    className={inputClass}
                                    placeholder="Your Role"
                                />
                                <input
                                    type="text"
                                    value={item.impact}
                                    onChange={(e) => updateActivity(index, 'impact', e.target.value)}
                                    className={inputClass}
                                    placeholder="Key Impact"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addActivity}
                        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-400 transition-all"
                    >
                        + Add Activity
                    </button>
                </div>
            </SectionCard>

            {/* Languages */}
            <SectionCard
                title="Languages"
                icon={Languages}
                isOpen={openSections.includes('languages')}
                onToggle={() => toggleSection('languages')}
            >
                <div className="space-y-3">
                    {resumeData.languages?.map((lang, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-center p-3 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700/50">
                            <div className="flex-1 w-full sm:w-auto">
                                <input
                                    type="text"
                                    value={lang.name}
                                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                                    className={inputClass}
                                    placeholder="Language"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <select
                                    value={lang.proficiency}
                                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                    className={`${inputClass} appearance-none cursor-pointer flex-1 sm:w-40`}
                                >
                                    <option value="Native">Native</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Basic">Basic</option>
                                </select>
                                {resumeData.languages.length > 1 && (
                                    <button onClick={() => removeLanguage(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLanguage}
                        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-dark-600 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-400 transition-all"
                    >
                        + Add Language
                    </button>
                </div>
            </SectionCard>

            {/* References */}
            <SectionCard
                title="References"
                icon={Users}
                isOpen={openSections.includes('references')}
                onToggle={() => toggleSection('references')}
            >
                <div className="p-4 bg-gray-50 dark:bg-dark-800/50 rounded-xl border border-dashed border-gray-300 dark:border-dark-600 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {resumeData.references?.[0]?.fullName || 'References available upon request'}
                    </p>
                </div>
            </SectionCard>
        </div>
    )
}
