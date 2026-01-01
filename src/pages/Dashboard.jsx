import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FileText, Plus, LogOut, User, Home, Linkedin, Globe, Lock, Check, ArrowRight,
    Sparkles, ChevronRight, Copy, Download
} from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import MultiStepModal from '../components/MultiStepModal'
import RefinementEngine from '../components/RefinementEngine'
import PricingScreen from '../components/PricingScreen'

const VIEWS = {
    HOME: 'home',
    MODAL: 'modal',
    REFINING: 'refining',
    EDITOR: 'editor',
    PRICING: 'pricing',
    LINKEDIN: 'linkedin',
    PORTFOLIO: 'portfolio',
}

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const [currentView, setCurrentView] = useState(VIEWS.HOME)
    const [activeTab, setActiveTab] = useState('home')
    const [resumeData, setResumeData] = useState(null)
    const [refinedData, setRefinedData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const firstName = displayName.split(' ')[0]

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
        if (tabId === 'home') setCurrentView(VIEWS.HOME)
        else if (tabId === 'linkedin') setCurrentView(VIEWS.LINKEDIN)
        else if (tabId === 'portfolio') setCurrentView(VIEWS.PORTFOLIO)
    }

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    const handleStartNewResume = () => {
        setCurrentView(VIEWS.MODAL)
    }

    const handleFormComplete = async (formData) => {
        setResumeData(formData)
        setCurrentView(VIEWS.REFINING)

        try {
            const response = await fetch('/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: formData }),
            })

            if (!response.ok) throw new Error('Failed to refine resume')

            const { refinedData: refined } = await response.json()
            setRefinedData(refined)
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
    }

    // === RENDER VIEWS ===
    if (currentView === VIEWS.MODAL) {
        return <MultiStepModal onComplete={handleFormComplete} onClose={handleBackToHome} />
    }

    if (currentView === VIEWS.REFINING) {
        return (
            <div className="min-h-screen animated-bg flex items-center justify-center p-4">
                <div className="text-center max-w-sm animate-fade-in">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-light-200 dark:border-dark-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-accent-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary-500 dark:text-primary-400 animate-pulse" />
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
                onDownloadPDF={handleDownloadPDF}
                onBack={handleBackToHome}
            />
        )
    }

    if (currentView === VIEWS.PRICING) {
        return <PricingScreen onBack={() => setCurrentView(VIEWS.EDITOR)} />
    }

    // === PREMIUM VIEWS ===
    const LinkedInView = () => (
        <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
                    <Linkedin className="w-8 h-8 text-white" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full mb-3 animate-pulse-slow">
                    <Lock className="w-3 h-3" /> Premium Service
                </div>
                <h1 className="text-2xl font-bold mb-2">LinkedIn Optimizer</h1>
                <p className="text-text-light-secondary dark:text-gray-400">Boost your profile visibility and attract recruiters</p>
            </div>

            <div className="glass rounded-2xl p-6 mb-6 hover:glow-teal transition-all duration-300">
                <div className="text-center mb-6">
                    <span className="text-4xl font-bold">500</span>
                    <span className="text-text-light-secondary dark:text-gray-400 ml-1">TK</span>
                </div>

                <ul className="space-y-3 mb-6">
                    {[
                        'Complete profile headline & summary rewrite',
                        'Experience section optimization',
                        'Personalized networking strategy',
                        'Connection request templates',
                        'Visibility improvement tactics'
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                            <span className="text-text-light-secondary dark:text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>

                <button className="group w-full py-3 bg-[#0A66C2] hover:bg-[#0958a8] rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95">
                    Unlock Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <p className="text-center text-xs text-text-light-secondary dark:text-gray-500">
                Secure payment • Delivery within 48 hours
            </p>
        </div>
    )

    const PortfolioView = () => (
        <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center mx-auto mb-4 animate-bounce-soft animate-glow-pulse">
                    <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full mb-3 animate-pulse-slow">
                    <Lock className="w-3 h-3" /> Premium Service
                </div>
                <h1 className="text-2xl font-bold mb-2">Ultimate Portfolio</h1>
                <p className="text-text-light-secondary dark:text-gray-400">Your own professional portfolio website</p>
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

                <button className="group w-full py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 glow-teal hover:-translate-y-0.5 active:scale-95">
                    Unlock Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <p className="text-center text-xs text-text-light-secondary dark:text-gray-500">
                Our team will contact you within 24 hours
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

            {/* Recent */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.4s' }}>
                <h2 className="font-semibold mb-3">Recent Resumes</h2>
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
            </div>
        </div>
    )

    // === MAIN LAYOUT ===
    return (
        <div className="min-h-screen animated-bg">
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
        </div>
    )
}
