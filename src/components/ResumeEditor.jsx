import { useState } from 'react'
import {
    ChevronDown, ChevronUp, Edit3, RefreshCw, Plus, Trash2, Check, X,
    User, Briefcase, GraduationCap, Wrench, Award, Languages, Users, FileText, Camera
} from 'lucide-react'

const inputClass = "w-full px-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"

/**
 * Collapsible Section Card
 */
function SectionCard({ title, icon: Icon, children, isOpen, onToggle, onRegenerate, regenerating }) {
    return (
        <div className="border border-light-200 dark:border-dark-700 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-primary-500/5 dark:bg-primary-500/10' : 'hover:bg-light-50 dark:hover:bg-dark-800'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    <span className="font-medium text-text-light-primary dark:text-white">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {onRegenerate && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRegenerate()
                            }}
                            disabled={regenerating}
                            className="p-1.5 text-text-light-secondary hover:text-primary-500 transition-colors"
                            title="Regenerate this section"
                        >
                            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-text-light-secondary dark:text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-text-light-secondary dark:text-gray-400" />
                    )}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 space-y-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

// Category color classes for visual distinction
const CATEGORY_COLORS = [
    'bg-primary-500/10 text-primary-600 dark:text-primary-400',
    'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'bg-green-500/10 text-green-600 dark:text-green-400',
    'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'bg-amber-500/10 text-amber-600 dark:text-amber-400',
]

export default function ResumeEditor({ resumeData, onUpdate, onRegenerate }) {
    const [openSections, setOpenSections] = useState(['summary', 'skills'])
    const [regenerating, setRegenerating] = useState(null)
    const [editingCategory, setEditingCategory] = useState(null)
    const [newSkillInput, setNewSkillInput] = useState('')
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

    const addSkillToCategory = (catIndex, skill) => {
        if (!skill.trim()) return
        const updated = [...(resumeData.skillCategories || [])]
        const existingSkills = updated[catIndex].skills || []
        if (!existingSkills.includes(skill.trim())) {
            updated[catIndex] = { ...updated[catIndex], skills: [...existingSkills, skill.trim()] }
            handleFieldChange('skillCategories', updated)
        }
        setNewSkillInput('')
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
            <div className="flex items-start gap-4 p-4 bg-light-50 dark:bg-dark-800/50 rounded-xl border border-light-200 dark:border-dark-700">
                {/* Photo Upload */}
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-light-200 dark:bg-dark-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-light-300 dark:border-dark-600">
                        {resumeData.profilePhoto ? (
                            <img src={resumeData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-text-light-secondary/50 dark:text-gray-600" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-7 h-7 bg-primary-500 dark:bg-primary-400 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <Camera className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-2">
                    <h2 className="text-xl font-bold text-text-light-primary dark:text-white">
                        {resumeData.fullName}
                    </h2>
                    <p className="text-sm text-text-light-secondary dark:text-gray-400">
                        {[resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).join(' • ')}
                    </p>
                    <p className="text-xs text-primary-500 dark:text-primary-400">
                        Target: {resumeData._targetJobTitle} • {resumeData._experienceLevel}
                    </p>
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
                    placeholder="Your career objective..."
                />
            </SectionCard>

            {/* Experience */}
            <SectionCard
                title="Work Experience"
                icon={Briefcase}
                isOpen={openSections.includes('experience')}
                onToggle={() => toggleSection('experience')}
            >
                {resumeData.experience?.map((exp, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-dark-900 rounded-lg border border-light-100 dark:border-dark-600">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary-500">Position #{index + 1}</span>
                            {resumeData.experience.length > 1 && (
                                <button onClick={() => removeExperience(index)} className="text-text-light-secondary hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
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
                        <div className="grid grid-cols-2 gap-2 mb-2">
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
                            placeholder="Job responsibilities and achievements..."
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addExperience}
                    className="w-full py-2 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-lg text-text-light-secondary dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
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
                            <div key={catIndex} className="p-3 bg-white dark:bg-dark-900 rounded-lg border border-light-100 dark:border-dark-600">
                                {/* Category Header */}
                                <div className="flex items-center justify-between mb-2">
                                    {editingCategory === catIndex ? (
                                        <input
                                            type="text"
                                            value={cat.category}
                                            onChange={(e) => updateSkillCategory(catIndex, 'category', e.target.value)}
                                            onBlur={() => setEditingCategory(null)}
                                            onKeyPress={(e) => e.key === 'Enter' && setEditingCategory(null)}
                                            className="text-sm font-semibold text-text-light-primary dark:text-white bg-transparent border-b border-primary-500 focus:outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            className="text-sm font-semibold text-text-light-primary dark:text-white cursor-pointer hover:text-primary-500"
                                            onClick={() => setEditingCategory(catIndex)}
                                        >
                                            {cat.category}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingCategory(catIndex)}
                                            className="p-1 text-text-light-secondary hover:text-primary-500"
                                            title="Rename category"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        {(resumeData.skillCategories?.length || 0) > 1 && (
                                            <button
                                                onClick={() => removeCategory(catIndex)}
                                                className="p-1 text-text-light-secondary hover:text-red-500"
                                                title="Remove category"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Skills in Category */}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {cat.skills?.map((skill, skillIndex) => (
                                        <span key={skillIndex} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${colorClass}`}>
                                            {skill}
                                            <button onClick={() => removeSkillFromCategory(catIndex, skill)} className="hover:text-red-500">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                {/* Add Skill to Category */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={editingCategory === catIndex ? newSkillInput : ''}
                                        onChange={(e) => { setEditingCategory(catIndex); setNewSkillInput(e.target.value) }}
                                        onFocus={() => setEditingCategory(catIndex)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                addSkillToCategory(catIndex, newSkillInput)
                                            }
                                        }}
                                        className={`flex-1 text-sm ${inputClass}`}
                                        placeholder={`Add skill to ${cat.category}...`}
                                    />
                                    <button
                                        onClick={() => addSkillToCategory(catIndex, newSkillInput)}
                                        className="px-3 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-white text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {/* Add New Category */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewCategory())}
                            className={`flex-1 ${inputClass}`}
                            placeholder="New category name (e.g., Cloud Technologies)..."
                        />
                        <button
                            onClick={addNewCategory}
                            className="px-4 py-2 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-xl text-primary-500 hover:bg-primary-500/10 text-sm flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Category
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Extra-Curricular */}
            <SectionCard
                title="Extra-Curricular Activities"
                icon={Award}
                isOpen={openSections.includes('activities')}
                onToggle={() => toggleSection('activities')}
            >
                {resumeData.extraCurricular?.map((item, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-dark-900 rounded-lg border border-light-100 dark:border-dark-600">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary-500">Activity #{index + 1}</span>
                            {resumeData.extraCurricular.length > 1 && (
                                <button onClick={() => removeActivity(index)} className="text-text-light-secondary hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                    className="w-full py-2 border-2 border-dashed border-light-300 dark:border-dark-600 rounded-lg text-text-light-secondary dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" /> Add Activity
                </button>
            </SectionCard>

            {/* Languages */}
            <SectionCard
                title="Languages"
                icon={Languages}
                isOpen={openSections.includes('languages')}
                onToggle={() => toggleSection('languages')}
            >
                {resumeData.languages?.map((lang, index) => (
                    <div key={index} className="flex gap-2 items-center">
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
                            <option value="Native">Native</option>
                            <option value="Professional">Professional</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                        </select>
                        {resumeData.languages.length > 1 && (
                            <button onClick={() => removeLanguage(index)} className="p-2 text-text-light-secondary hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addLanguage}
                    className="text-sm text-primary-500 hover:underline flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add Language
                </button>
            </SectionCard>

            {/* References */}
            <SectionCard
                title="References"
                icon={Users}
                isOpen={openSections.includes('references')}
                onToggle={() => toggleSection('references')}
            >
                <p className="text-sm text-text-light-secondary dark:text-gray-400 italic">
                    {resumeData.references?.[0]?.fullName || 'Available upon request'}
                </p>
            </SectionCard>
        </div>
    )
}
