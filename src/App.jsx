import { useState } from 'react'
import InputHub from './components/InputHub'
import MultiStepModal from './components/MultiStepModal'
import RefinementEngine from './components/RefinementEngine'
import PricingScreen from './components/PricingScreen'

const VIEWS = {
    INPUT: 'input',
    MODAL: 'modal',
    REFINING: 'refining',
    EDITOR: 'editor',
    PRICING: 'pricing',
    ERROR: 'error',
}

const API_BASE_URL = 'http://localhost:3001'

function App() {
    const [currentView, setCurrentView] = useState(VIEWS.INPUT)
    const [resumeData, setResumeData] = useState(null)
    const [refinedData, setRefinedData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('success')
    const [errorMessage, setErrorMessage] = useState('')

    const handleStartFromScratch = () => {
        setCurrentView(VIEWS.MODAL)
    }

    const handleUploadFile = (file) => {
        // Simulate file parsing (in production, this would call a parsing API)
        const mockParsedData = {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            summary: 'Experienced software developer with 5 years of experience building web applications.',
            workHistory: [
                {
                    company: 'Tech Corp',
                    position: 'Senior Developer',
                    startDate: '2021-01',
                    endDate: 'Present',
                    description: 'Worked on building web applications. Helped the team with various projects. Made improvements to the codebase.',
                }
            ],
            education: [
                {
                    institution: 'State University',
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    graduationYear: '2019',
                }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        }
        setResumeData(mockParsedData)
        startRefinement(mockParsedData)
    }

    const handleFormComplete = (formData) => {
        setResumeData(formData)
        startRefinement(formData)
    }

    const startRefinement = async (data) => {
        setCurrentView(VIEWS.REFINING)
        setErrorMessage('')

        try {
            const response = await fetch(`${API_BASE_URL}/api/refine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeData: data }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to refine resume')
            }

            const { refinedData: refined } = await response.json()
            setRefinedData(refined)
            setCurrentView(VIEWS.EDITOR)
        } catch (error) {
            console.error('Refinement error:', error)

            // Check if it's a network error (server not running)
            if (error.message === 'Failed to fetch') {
                setErrorMessage('Could not connect to AI server. Make sure to run: npm run server')
            } else {
                setErrorMessage(error.message)
            }
            setCurrentView(VIEWS.ERROR)
        }
    }

    const handleCopyText = () => {
        const textContent = formatResumeAsText(refinedData)
        navigator.clipboard.writeText(textContent)
        showToastNotification('Resume copied to clipboard!', 'success')
    }

    const handleDownloadPDF = () => {
        setCurrentView(VIEWS.PRICING)
    }

    const formatResumeAsText = (data) => {
        if (!data) return ''
        let text = `${data.fullName}\n${data.email} | ${data.phone} | ${data.location}\n\n`
        text += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`
        text += `WORK EXPERIENCE\n`
        data.workHistory?.forEach(job => {
            text += `${job.position} at ${job.company} (${job.startDate} - ${job.endDate})\n${job.description}\n\n`
        })
        text += `EDUCATION\n`
        data.education?.forEach(edu => {
            text += `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationYear})\n`
        })
        text += `\nSKILLS\n${data.skills?.join(', ')}`
        return text
    }

    const showToastNotification = (message, type = 'success') => {
        setToastMessage(message)
        setToastType(type)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const handleBackToInput = () => {
        setCurrentView(VIEWS.INPUT)
        setResumeData(null)
        setRefinedData(null)
        setErrorMessage('')
    }

    const handleRetry = () => {
        if (resumeData) {
            startRefinement(resumeData)
        } else {
            setCurrentView(VIEWS.INPUT)
        }
    }

    return (
        <div className="min-h-screen animated-bg">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-slide-up">
                    <div className={`glass px-6 py-4 rounded-xl flex items-center gap-3 ${toastType === 'success' ? 'glow-violet' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toastType === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {toastType === 'success' ? (
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {currentView === VIEWS.INPUT && (
                <InputHub
                    onStartFromScratch={handleStartFromScratch}
                    onUploadFile={handleUploadFile}
                />
            )}

            {currentView === VIEWS.MODAL && (
                <MultiStepModal
                    onComplete={handleFormComplete}
                    onClose={handleBackToInput}
                />
            )}

            {currentView === VIEWS.REFINING && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full border-4 border-dark-700"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                            <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Refining with Gemini AI<span className="loading-dots"></span></h2>
                        <p className="text-gray-400">Enhancing your resume with professional language</p>
                    </div>
                </div>
            )}

            {currentView === VIEWS.ERROR && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-6">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">AI Refinement Failed</h2>
                        <p className="text-gray-400 mb-6">{errorMessage}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleBackToInput}
                                className="px-6 py-3 bg-dark-700 hover:bg-dark-600 rounded-xl text-white font-medium transition-all"
                            >
                                Start Over
                            </button>
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-medium transition-all glow-violet"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {currentView === VIEWS.EDITOR && (
                <RefinementEngine
                    originalData={resumeData}
                    refinedData={refinedData}
                    onCopyText={handleCopyText}
                    onDownloadPDF={handleDownloadPDF}
                    onBack={handleBackToInput}
                />
            )}

            {currentView === VIEWS.PRICING && (
                <PricingScreen
                    onBack={() => setCurrentView(VIEWS.EDITOR)}
                />
            )}
        </div>
    )
}

export default App
