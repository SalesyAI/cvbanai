import { useState, useRef } from 'react'
import {
    ArrowLeft, X, Check, Copy, Download, Sparkles, FileCheck
} from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumePDF from './ResumePDF'
import QuickStartForm from './QuickStartForm'
import ResumeEditor from './ResumeEditor'
import { useAuth } from '../context/AuthContext'

const STEPS = [
    { id: 'quick-start', title: 'Quick Start', subtitle: 'Enter basic details' },
    { id: 'review', title: 'Review & Customize', subtitle: 'Edit your AI-generated resume' },
    { id: 'download', title: 'Download', subtitle: 'Get your professional resume' },
]

export default function CVGeneratorFlow({ onComplete, onBack }) {
    const { session } = useAuth()
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)
    const contentRef = useRef(null)

    // Resume data state
    const [resumeData, setResumeData] = useState(null)

    // Handle Quick Start form submission
    const handleQuickStartSubmit = async (quickInput) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ quickInput })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate resume')
            }

            if (data.success && data.resumeData) {
                setResumeData(data.resumeData)
                setCurrentStep(1)
                contentRef.current?.scrollTo(0, 0)
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (err) {
            console.error('Generation error:', err)
            setError(err.message || 'Failed to generate resume. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Handle resume data updates from editor
    const handleResumeUpdate = (updatedData) => {
        setResumeData(updatedData)
    }

    // Handle section regeneration
    const handleRegenerate = async (section) => {
        // For now, just log - could implement per-section regeneration
        console.log('Regenerate section:', section)
        // Future: call API to regenerate specific section
    }

    // Proceed to download step
    const proceedToDownload = () => {
        setCurrentStep(2)
        contentRef.current?.scrollTo(0, 0)
    }

    // Go back a step
    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
            contentRef.current?.scrollTo(0, 0)
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
        if (!resumeData) return ''
        let text = `${resumeData.fullName}\n${resumeData.email} | ${resumeData.phone} | ${resumeData.location}\n\n`
        text += `CAREER OBJECTIVE\n${resumeData.careerObjective}\n\n`
        text += `SKILLS\n${resumeData.technicalSkills?.join(', ')}\n\n`
        text += `TOOLS\n${resumeData.tools?.join(', ')}\n`
        return text
    }

    // Calculate ATS score
    const calculateATSScore = () => {
        if (!resumeData) return 0
        let score = 0
        if (resumeData.fullName) score += 10
        if (resumeData.email) score += 10
        if (resumeData.phone) score += 5
        if (resumeData.careerObjective?.length > 50) score += 15
        if (resumeData.education?.honors?.institution) score += 15
        if (resumeData.technicalSkills?.length >= 5) score += 20
        if (resumeData.tools?.length >= 3) score += 10
        if (resumeData.languages?.length >= 2) score += 10
        if (resumeData.extraCurricular?.[0]?.activity) score += 5
        return Math.min(score, 98)
    }

    const progress = ((currentStep + 1) / STEPS.length) * 100

    // Render Step 1: Quick Start
    const renderQuickStart = () => (
        <div className="animate-fade-in">
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}
            <QuickStartForm onSubmit={handleQuickStartSubmit} isLoading={isLoading} />
        </div>
    )

    // Render Step 2: Review & Customize
    const renderReview = () => (
        <div className="animate-fade-in">
            {resumeData && (
                <>
                    {/* Success message */}
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700 dark:text-green-400">AI Generated Your Resume!</h3>
                                <p className="text-sm text-green-600 dark:text-green-500">Review the content below and make any changes you need.</p>
                            </div>
                        </div>
                    </div>

                    {/* Resume Editor */}
                    <ResumeEditor
                        resumeData={resumeData}
                        onUpdate={handleResumeUpdate}
                        onRegenerate={handleRegenerate}
                    />
                </>
            )}
        </div>
    )

    // Render Step 3: Download
    const renderDownload = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Success Header */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-text-light-primary dark:text-white">Your Resume is Ready!</h2>
                <p className="text-sm text-text-light-secondary dark:text-gray-400">Download your professional resume</p>
            </div>

            {/* ATS Score */}
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

            {/* Resume Preview Card */}
            <div className="bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl p-6 shadow-lg">
                <div className="border-b border-light-200 dark:border-dark-700 pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-text-light-primary dark:text-white">{resumeData?.fullName}</h3>
                    <p className="text-sm text-text-light-secondary dark:text-gray-400 mt-1">
                        {[resumeData?.email, resumeData?.phone, resumeData?.location].filter(Boolean).join(' • ')}
                    </p>
                </div>

                {resumeData?.careerObjective && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">Career Objective</h4>
                        <p className="text-sm text-text-light-primary dark:text-gray-300">{resumeData.careerObjective}</p>
                    </div>
                )}

                {resumeData?.technicalSkills?.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {resumeData.technicalSkills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-light-100 dark:bg-dark-700 text-text-light-primary dark:text-gray-300 rounded text-xs">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {resumeData?.tools?.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-2">Tools</h4>
                        <p className="text-sm text-text-light-secondary dark:text-gray-400">{resumeData.tools.join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    )

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return renderQuickStart()
            case 1: return renderReview()
            case 2: return renderDownload()
            default: return null
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950">
            {/* Header Removed as per user request */}

            {/* Content */}
            <main ref={contentRef} className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-lg mx-auto">
                    {renderStepContent()}
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="sticky bottom-0 z-20 bg-white/95 dark:bg-dark-950/95 backdrop-blur-sm border-t border-light-200 dark:border-dark-700 px-4 py-3">
                <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
                    {/* Back Button */}
                    <button
                        onClick={currentStep === 0 ? onBack : goBack}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-text-light-secondary dark:text-gray-400 hover:text-text-light-primary dark:hover:text-white hover:bg-light-100 dark:hover:bg-dark-800 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> {currentStep === 0 ? 'Cancel' : 'Back'}
                    </button>

                    {/* Primary Action */}
                    {currentStep === 0 && (
                        <div className="text-sm text-text-light-secondary dark:text-gray-400">
                            Fill the form and click Generate
                        </div>
                    )}

                    {currentStep === 1 && (
                        <button
                            onClick={proceedToDownload}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                        >
                            Continue to Download
                        </button>
                    )}

                    {currentStep === 2 && resumeData && (
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
                                document={<ResumePDF data={resumeData} />}
                                fileName={`${resumeData.fullName || 'Resume'}_CV.pdf`}
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </PDFDownloadLink>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    )
}
