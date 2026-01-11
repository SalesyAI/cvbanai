import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FileText, Plus, LogOut, User, Home, Linkedin, Globe, Lock, Check, ArrowRight,
    Sparkles, ChevronRight, Copy, Download, Trash, Edit, Clock
} from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import MultiStepModal from '../components/MultiStepModal'
import RefinementEngine from '../components/RefinementEngine'
import PricingScreen from '../components/PricingScreen'
import PaymentSuccessModal from '../components/PaymentSuccessModal'
import PaymentModal from '../components/PaymentModal'
import LinkedInOptimizerWorkflow from '../components/LinkedInOptimizerWorkflow'
import PortfolioWhatsAppModal from '../components/PortfolioWhatsAppModal'
import { resumeService } from '../services/resumeService'

const VIEWS = {
    HOME: 'home',
    MODAL: 'modal',
    REFINING: 'refining',
    EDITOR: 'editor',
    PRICING: 'pricing',
    LINKEDIN: 'linkedin',
    PORTFOLIO: 'portfolio',
    LINKEDIN_WORKFLOW: 'linkedin_workflow',
}

export default function Dashboard() {
    const { user, signOut, session } = useAuth()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [currentView, setCurrentView] = useState(VIEWS.HOME)
    const [activeTab, setActiveTab] = useState('home')
    const [resumeData, setResumeData] = useState(null)
    const [refinedData, setRefinedData] = useState(null)
    const [currentResumeId, setCurrentResumeId] = useState(null)
    const [recentResumes, setRecentResumes] = useState([])
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [isLoadingResumes, setIsLoadingResumes] = useState(true)

    // Payment state
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
    const [showContextualPayment, setShowContextualPayment] = useState(false)
    const [showPortfolioWhatsApp, setShowPortfolioWhatsApp] = useState(false)
    const [paymentProductId, setPaymentProductId] = useState('linkedin')
    const [paymentStatus, setPaymentStatus] = useState(null) // 'success' | 'failed' | 'cancelled'
    const [paymentTrxID, setPaymentTrxID] = useState(null)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    const [hasLinkedInAccess, setHasLinkedInAccess] = useState(false)
    const [hasPortfolioAccess, setHasPortfolioAccess] = useState(false)

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const firstName = displayName.split(' ')[0]

    useEffect(() => {
        setIsVisible(true)
        if (user) {
            loadResumes()
            checkPurchaseStatus()
            handlePaymentCallback()
        }
    }, [user])

    // Check if user has purchased premium services
    const checkPurchaseStatus = async () => {
        try {
            // Check LinkedIn purchase
            const linkedinRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId: 'linkedin' })
            })
            const linkedinData = await linkedinRes.json()
            setHasLinkedInAccess(linkedinData.hasPurchased || false)

            // Check Portfolio purchase
            const portfolioRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId: 'portfolio' })
            })
            const portfolioData = await portfolioRes.json()
            setHasPortfolioAccess(portfolioData.hasPurchased || false)
        } catch (error) {
            console.error('Error checking purchase status:', error)
        }
    }

    // Handle payment callback from bKash
    const handlePaymentCallback = async () => {
        const payment = searchParams.get('payment')
        const trxID = searchParams.get('trxID')
        const productIdFromUrl = searchParams.get('productId')

        if (payment) {
            setIsProcessingPayment(true)
            setPaymentStatus(payment)
            setPaymentTrxID(trxID)
            setPaymentProductId(productIdFromUrl || 'linkedin')

            // Artificial delay for smooth transition
            setTimeout(() => {
                setShowPaymentSuccess(true)
                setIsProcessingPayment(false)

                // Update access state after success (but don't auto-navigate)
                if (payment === 'success') {
                    if (productIdFromUrl === 'linkedin') {
                        setHasLinkedInAccess(true)
                    } else if (productIdFromUrl === 'portfolio') {
                        setHasPortfolioAccess(true)
                    }
                }
            }, 1500)

            // Clear URL params
            setSearchParams({})
        }
    }

    const loadResumes = async () => {
        try {
            setIsLoadingResumes(true)
            const resumes = await resumeService.getUserResumes()
            setRecentResumes(resumes || [])
        } catch (error) {
            console.error('Error loading resumes:', error)
            showToastNotification('Failed to load recent resumes')
        } finally {
            setIsLoadingResumes(false)
        }
    }

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
        if (tabId === 'home') {
            setCurrentView(VIEWS.HOME)
            loadResumes() // Refresh list when returning home
        }
        else if (tabId === 'linkedin') setCurrentView(VIEWS.LINKEDIN)
        else if (tabId === 'portfolio') setCurrentView(VIEWS.PORTFOLIO)
    }

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    const handleStartNewResume = () => {
        setResumeData(null)
        setRefinedData(null)
        setCurrentResumeId(null)
        setCurrentView(VIEWS.MODAL)
    }

    const handleFormComplete = async (formData) => {
        setResumeData(formData)
        setCurrentView(VIEWS.REFINING)

        try {
            // Save initial draft
            let resumeId = currentResumeId
            if (!resumeId) {
                const newResume = await resumeService.createResume(user.id, formData)
                resumeId = newResume.id
                setCurrentResumeId(resumeId)
            } else {
                await resumeService.updateResume(resumeId, { content: formData })
            }

            // AI Refinement
            const response = await fetch('/api/refine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ resumeData: formData }),
            })

            let refined = null
            if (!response.ok) {
                console.warn('Backend API failed, using simulation')
                refined = simulateRefinement(formData)
            } else {
                const { refinedData } = await response.json()
                refined = refinedData
            }

            setRefinedData(refined)

            // Save refined data to DB
            if (resumeId) {
                await resumeService.updateResume(resumeId, {
                    content: refined,
                    status: 'refined'
                })
            }

            setCurrentView(VIEWS.EDITOR)
        } catch (error) {
            console.error('Refinement error:', error)
            const simulated = simulateRefinement(formData)
            setRefinedData(simulated)
            setCurrentView(VIEWS.EDITOR)
        }
    }

    const simulateRefinement = (data) => ({
        ...data,
        summary: data.summary?.replace(/Experienced/g, 'Results-driven') + ' Proven track record of success.',
        summaryImprovements: ['Enhanced with action words', 'Added impact statement'],
        workHistory: data.workHistory?.map(job => ({
            ...job,
            description: job.description?.replace(/Worked on/g, 'Spearheaded')?.replace(/Helped/g, 'Collaborated with teams to'),
            improvements: [{ original: 'Worked on', improved: 'Spearheaded' }],
        })) || [],
    })

    const handleResumeSelect = (resume) => {
        setResumeData(resume.content)
        setRefinedData(resume.content) // Assuming stored content is the latest version
        setCurrentResumeId(resume.id)
        setCurrentView(VIEWS.EDITOR)
    }

    const handleDeleteResume = async (e, id) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this resume?')) {
            try {
                await resumeService.deleteResume(id)
                setRecentResumes(prev => prev.filter(r => r.id !== id))
                showToastNotification('Resume deleted')
            } catch (error) {
                console.error('Error deleting resume:', error)
                showToastNotification('Failed to delete resume')
            }
        }
    }

    const handleCopyText = () => {
        const text = formatResumeAsText(refinedData)
        navigator.clipboard.writeText(text)
        showToastNotification('Resume copied to clipboard!')
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
        return text
    }

    const showToastNotification = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const handleBackToHome = () => {
        setCurrentView(VIEWS.HOME)
        setActiveTab('home')
        setResumeData(null)
        setRefinedData(null)
        setCurrentResumeId(null)
        loadResumes()
    }

    // === RENDER VIEWS ===
    if (currentView === VIEWS.MODAL) {
        return <MultiStepModal onComplete={handleFormComplete} onClose={handleBackToHome} initialData={resumeData} />
    }

    if (currentView === VIEWS.REFINING) {
        return (
            <div className="min-h-screen animated-bg flex items-center justify-center p-4">
                <div className="text-center max-w-sm animate-fade-in">
                    <div className="mb-8">
                        <p className="loader"><span>Scan</span></p>
                    </div>
                    <h2 className="text-xl font-bold mb-2">AI is enhancing your resume<span className="loading-dots"></span></h2>
                    <p className="text-text-light-secondary dark:text-gray-400 text-sm">Making your experience shine with professional language</p>
                </div>
            </div>
        )
    }

    if (currentView === VIEWS.EDITOR) {
        return (
            <RefinementEngine
                originalData={resumeData}
                refinedData={refinedData}
                onCopyText={handleCopyText}
                onBack={handleBackToHome}
            />
        )
    }

    if (currentView === VIEWS.PRICING) {
        return <PricingScreen onBack={() => setCurrentView(VIEWS.EDITOR)} />
    }

    if (currentView === VIEWS.LINKEDIN_WORKFLOW) {
        return (
            <LinkedInOptimizerWorkflow
                onBack={handleBackToHome}
                hasPurchased={hasLinkedInAccess}
                onRequestPayment={() => {
                    setPaymentProductId('linkedin')
                    setShowContextualPayment(true)
                }}
            />
        )
    }

    // === PREMIUM VIEWS ===
    const LinkedInView = () => (
        <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
                    <Linkedin className="w-8 h-8 text-white" />
                </div>
                {hasLinkedInAccess ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full mb-3">
                        <Check className="w-3 h-3" /> Purchased
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full mb-3 animate-pulse-slow">
                        <Lock className="w-3 h-3" /> Premium Service
                    </div>
                )}
                <h1 className="text-2xl font-bold mb-2">LinkedIn Optimizer</h1>
                <p className="text-text-light-secondary dark:text-gray-400">
                    {hasLinkedInAccess ? 'Generate your optimized LinkedIn profile' : 'AI-powered profile enhancement'}
                </p>
            </div>

            <div className="glass rounded-2xl p-6 mb-6 hover:glow-teal transition-all duration-300">
                {!hasLinkedInAccess && (
                    <div className="text-center mb-6">
                        <span className="text-4xl font-bold">500</span>
                        <span className="text-text-light-secondary dark:text-gray-400 ml-1">TK</span>
                    </div>
                )}

                <ul className="space-y-3 mb-6">
                    {[
                        'AI-generated headline & summary',
                        'Experience section optimization',
                        'Personalized networking strategy',
                        'Connection request templates',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                            <span className="text-text-light-secondary dark:text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>

                {hasLinkedInAccess ? (
                    <button
                        onClick={() => setCurrentView(VIEWS.LINKEDIN_WORKFLOW)}
                        className="group w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                    >
                        Open Optimizer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setPaymentProductId('linkedin')
                            setShowContextualPayment(true)
                        }}
                        className="group w-full py-3 bg-[#0A66C2] hover:bg-[#0958a8] rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                    >
                        Unlock Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            <p className="text-center text-xs text-text-light-secondary dark:text-gray-500">
                {hasLinkedInAccess ? 'You have unlimited access' : 'Secure payment • Instant access'}
            </p>
        </div>
    )

    const PortfolioView = () => (
        <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center mx-auto mb-4 animate-bounce-soft animate-glow-pulse">
                    <Globe className="w-8 h-8 text-white" />
                </div>
                {hasPortfolioAccess ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full mb-3">
                        <Check className="w-3 h-3" /> Purchased
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full mb-3 animate-pulse-slow">
                        <Lock className="w-3 h-3" /> Premium Service
                    </div>
                )}
                <h1 className="text-2xl font-bold mb-2">Portfolio Website</h1>
                <p className="text-text-light-secondary dark:text-gray-400">
                    {hasPortfolioAccess ? 'Your portfolio is being crafted!' : 'Your own professional website'}
                </p>
            </div>

            <div className="gradient-border rounded-2xl p-6 mb-6 hover:glow-teal transition-all duration-300">
                <div className="text-center mb-6">
                    <span className="text-4xl font-bold">1000</span>
                    <span className="text-text-light-secondary dark:text-gray-400 ml-1">TK</span>
                </div>

                <ul className="space-y-3 mb-6">
                    {[
                        'Custom one-page portfolio website',
                        'Mobile-responsive modern design',
                        'Project showcase section',
                        'Contact form integration',
                        'Free hosting included',
                        'Shareable custom link'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                            <span className="text-text-light-secondary dark:text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>

                {hasPortfolioAccess ? (
                    <button
                        onClick={() => setShowPortfolioWhatsApp(true)}
                        className="group w-full py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
                    >
                        Update Contact Info <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setPaymentProductId('portfolio')
                            setShowContextualPayment(true)
                        }}
                        className="group w-full py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 glow-teal hover:-translate-y-0.5 active:scale-95"
                    >
                        Unlock Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            <p className="text-center text-xs text-text-light-secondary dark:text-gray-500">
                {hasPortfolioAccess ? "We'll contact you via WhatsApp within 24 hours" : 'Secure payment • Delivery within 48 hours'}
            </p>
        </div>
    )

    const HomeView = () => (
        <div className="max-w-3xl mx-auto py-6 px-4">
            {/* Welcome */}
            <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="text-2xl font-bold mb-1">Hey, {firstName} 👋</h1>
                <p className="text-text-light-secondary dark:text-gray-400">Ready to build something amazing?</p>
            </div>

            {/* Main CTA */}
            <button
                onClick={handleStartNewResume}
                className={`w-full p-6 gradient-border rounded-2xl text-left mb-6 group hover:glow-teal transition-all duration-500 hover:-translate-y-1 active:scale-[0.99] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: '0.1s' }}
            >
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-500 dark:bg-primary-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Plus className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                            Create New Resume
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h2>
                        <p className="text-text-light-secondary dark:text-gray-400 text-sm">
                            Answer a few questions and let AI craft your professional resume
                        </p>
                    </div>
                </div>
            </button>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div
                    className={`group glass rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-default ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Copy className="w-5 h-5 text-accent-500 dark:text-accent-400" />
                    </div>
                    <h3 className="font-semibold mb-1">Copy & Paste</h3>
                    <p className="text-sm text-text-light-secondary dark:text-gray-400">Get professional copy you can use anywhere</p>
                </div>
                <div
                    className={`group glass rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 cursor-default ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: '0.3s' }}
                >
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Download className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold mb-1">PDF Export</h3>
                    <p className="text-sm text-text-light-secondary dark:text-gray-400">Download beautiful, ATS-friendly PDF</p>
                </div>
            </div>

            {/* Recent Resumes */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold">Recent Resumes</h2>
                    {recentResumes.length > 0 && (
                        <span className="text-xs text-text-light-secondary dark:text-gray-500 bg-light-100 dark:bg-dark-800 px-2 py-0.5 rounded-full">
                            {recentResumes.length} saved
                        </span>
                    )}
                </div>

                {/* Loading State */}
                {isLoadingResumes && recentResumes.length === 0 && (
                    <div className="glass rounded-xl p-8 text-center animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 mx-auto rounded"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingResumes && recentResumes.length === 0 && (
                    <div className="glass rounded-xl p-8 text-center hover:glow-mint transition-all duration-300">
                        <FileText className="w-10 h-10 text-text-light-secondary/20 dark:text-gray-700 mx-auto mb-3" />
                        <p className="text-text-light-secondary dark:text-gray-500 text-sm mb-4">No resumes yet</p>
                        <button
                            onClick={handleStartNewResume}
                            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Create Your First
                        </button>
                    </div>
                )}

                {/* Resumes Grid */}
                {recentResumes.length > 0 && (
                    <div className="space-y-3">
                        {recentResumes.map((resume, i) => (
                            <div
                                key={resume.id}
                                onClick={() => handleResumeSelect(resume)}
                                className="group glass p-4 rounded-xl flex items-center justify-between hover:bg-light-100 dark:hover:bg-dark-800 transition-all duration-200 cursor-pointer stagger-item border-l-4 border-transparent hover:border-primary-500"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-text-light-secondary/10 dark:bg-gray-700 flex items-center justify-center text-text-light-secondary dark:text-gray-400 group-hover:bg-primary-500/20 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {resume.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-text-light-secondary dark:text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(resume.updated_at).toLocaleDateString()}
                                            </span>
                                            {resume.status === 'refined' && (
                                                <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                    <Sparkles className="w-3 h-3" />
                                                    Enhanced
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteResume(e, resume.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete resume"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

    // === MAIN LAYOUT ===
    return (
        <div className="min-h-screen animated-bg">
            {/* Processing Overlay */}
            {isProcessingPayment && (
                <div className="fixed inset-0 z-[100] bg-white/90 dark:bg-dark-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-light-200 dark:border-dark-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Finalizing your purchase</h2>
                    <p className="text-text-light-secondary dark:text-gray-400">Verifying payment with bKash...</p>
                </div>
            )}

            {/* Contextual Payment Modal (for LinkedIn/Portfolio) */}
            <PaymentModal
                isOpen={showContextualPayment}
                onClose={() => setShowContextualPayment(false)}
                productId={paymentProductId}
            />

            {/* Payment Success/Feedback Modal */}
            <PaymentSuccessModal
                isOpen={showPaymentSuccess}
                status={paymentStatus}
                trxID={paymentTrxID}
                productId={paymentProductId}
                onClose={() => setShowPaymentSuccess(false)}
                onContinue={() => {
                    setShowPaymentSuccess(false)
                    // Route to appropriate view based on product
                    if (paymentStatus === 'success') {
                        if (paymentProductId === 'linkedin') {
                            setActiveTab('linkedin')
                            setCurrentView(VIEWS.LINKEDIN_WORKFLOW)
                        } else if (paymentProductId === 'portfolio') {
                            setShowPortfolioWhatsApp(true)
                        }
                    } else {
                        // Failed/cancelled - go to pricing
                        setCurrentView(VIEWS.PRICING)
                    }
                }}
            />

            {/* Toast */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 toast-enter">
                    <div className="glass px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg glow-teal">
                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-light-200 dark:border-dark-700">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to="/" className="group">
                        <Logo className="h-8 group-hover:scale-105 transition-transform duration-300" textColor="text-text-light-primary dark:text-white" />
                    </Link>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="flex items-center gap-2 pl-3 border-l border-light-200 dark:border-dark-700">
                            <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center hover:scale-110 transition-transform cursor-default">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium hidden sm:block">{firstName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-text-light-secondary dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all hover:scale-110 active:scale-95"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="sticky top-[57px] z-20 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-light-200 dark:border-dark-700">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto py-2">
                        {[
                            { id: 'home', label: 'Dashboard', icon: Home },
                            { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin, locked: true },
                            { id: 'portfolio', label: 'Portfolio Website', icon: Globe, locked: true },
                        ].map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-95 ${isActive
                                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                                        : 'text-text-light-secondary dark:text-gray-400 hover:bg-light-100 dark:hover:bg-dark-800'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                                    {tab.label}
                                    {tab.locked && <Lock className="w-3 h-3 text-amber-500 animate-pulse" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="pb-12">
                {currentView === VIEWS.LINKEDIN && <LinkedInView />}
                {currentView === VIEWS.PORTFOLIO && <PortfolioView />}
                {currentView === VIEWS.HOME && <HomeView />}
            </main>

            {/* Portfolio WhatsApp Modal */}
            <PortfolioWhatsAppModal
                isOpen={showPortfolioWhatsApp}
                onClose={() => setShowPortfolioWhatsApp(false)}
                hasPurchased={hasPortfolioAccess}
                onRequestPayment={() => {
                    setShowPortfolioWhatsApp(false)
                    setPaymentProductId('portfolio')
                    setShowContextualPayment(true)
                }}
            />
        </div>
    )
}
