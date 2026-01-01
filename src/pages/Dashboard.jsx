import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FileText, Plus, LogOut, User, Settings, Home,
    ChevronRight, Sparkles, Clock, Menu, X, Linkedin, Globe, Lock, Check, ArrowRight
} from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

// Import the resume builder components
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

const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard', icon: Home, locked: false },
    { id: 'resumes', label: 'My Resumes', icon: FileText, locked: false },
    { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin, locked: true, premium: true },
    { id: 'portfolio', label: 'Ultimate Portfolio', icon: Globe, locked: true, premium: true },
    { id: 'settings', label: 'Settings', icon: Settings, locked: false },
]

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const [currentView, setCurrentView] = useState(VIEWS.HOME)
    const [activeNav, setActiveNav] = useState('home')
    const [resumeData, setResumeData] = useState(null)
    const [refinedData, setRefinedData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    // Get user display name
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

    const handleNavClick = (navId) => {
        setActiveNav(navId)
        setMobileSidebarOpen(false)

        if (navId === 'home') {
            setCurrentView(VIEWS.HOME)
        } else if (navId === 'linkedin') {
            setCurrentView(VIEWS.LINKEDIN)
        } else if (navId === 'portfolio') {
            setCurrentView(VIEWS.PORTFOLIO)
        }
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

            if (!response.ok) {
                throw new Error('Failed to refine resume')
            }

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
        setActiveNav('home')
        setResumeData(null)
        setRefinedData(null)
    }

    // Render different views
    if (currentView === VIEWS.MODAL) {
        return <MultiStepModal onComplete={handleFormComplete} onClose={handleBackToHome} />
    }

    if (currentView === VIEWS.REFINING) {
        return (
            <div className="min-h-screen animated-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full border-4 border-light-200 dark:border-dark-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                        <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-accent-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Refining with Gemini AI<span className="loading-dots"></span></h2>
                    <p className="text-text-light-secondary dark:text-gray-400">Enhancing your resume with professional language</p>
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

    // Render Premium Package Views
    const renderLinkedInView = () => (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center">
                    <Linkedin className="w-8 h-8 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold">LinkedIn Optimizer</h1>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> PREMIUM
                        </span>
                    </div>
                    <p className="text-text-light-secondary dark:text-gray-400">Boost your profile visibility and attract recruiters</p>
                </div>
            </div>

            {/* Package Card */}
            <div className="glass rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-extrabold">500</span>
                    <span className="text-text-light-secondary dark:text-gray-400">tk</span>
                </div>

                <h3 className="font-bold mb-4">What's Included:</h3>
                <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Full Profile Optimization</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Complete overhaul of your headline, summary, and experience sections</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Personalized Strategy Guide</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Tailored recommendations based on your industry and goals</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Networking Tips & Templates</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Connection request templates and engagement strategies</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Visibility Improvement Tactics</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">SEO optimization for LinkedIn search to get found by recruiters</p>
                        </div>
                    </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#0A66C2] hover:bg-[#0958a8] rounded-xl text-white font-semibold transition-all">
                    Unlock LinkedIn Optimizer
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <p className="text-center text-sm text-text-light-secondary dark:text-gray-500">
                Payment will be processed securely. Delivery within 24-48 hours.
            </p>
        </div>
    )

    const renderPortfolioView = () => (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-accent-600 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold">Ultimate Portfolio</h1>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> PREMIUM
                        </span>
                    </div>
                    <p className="text-text-light-secondary dark:text-gray-400">Your own professional portfolio website</p>
                </div>
            </div>

            {/* Package Card */}
            <div className="gradient-border rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-extrabold">1000</span>
                    <span className="text-text-light-secondary dark:text-gray-400">tk</span>
                </div>

                <h3 className="font-bold mb-4">What's Included:</h3>
                <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Custom One-Page Portfolio Website</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Beautifully designed, mobile-responsive personal website</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Project Showcase Section</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Highlight your best work with images, descriptions, and links</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Professional Personal Branding</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Consistent visual identity that makes you stand out</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Hosted & Ready to Share</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Free hosting included. Get a shareable link instantly</p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Contact Form Integration</p>
                            <p className="text-sm text-text-light-secondary dark:text-gray-400">Let recruiters and clients reach you directly</p>
                        </div>
                    </li>
                </ul>

                <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold transition-all glow-teal">
                    Unlock Ultimate Portfolio
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <p className="text-center text-sm text-text-light-secondary dark:text-gray-500">
                Our team will contact you within 24 hours to gather your information.
            </p>
        </div>
    )

    const renderHomeView = () => (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {displayName.split(' ')[0]}!</h1>
                <p className="text-text-light-secondary dark:text-gray-400">Ready to build your next career-winning resume?</p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                {/* Create New Resume */}
                <button
                    onClick={handleStartNewResume}
                    className="group p-5 md:p-6 gradient-border rounded-2xl text-left hover:glow-teal transition-all duration-500"
                >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-500 dark:bg-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
                        Create New Resume
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">Start fresh with our guided resume builder</p>
                </button>

                {/* AI Enhancement */}
                <div className="p-5 md:p-6 glass rounded-2xl text-left">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-500 dark:bg-accent-400/20 flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-accent-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">AI Enhancement</h3>
                    <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">Powered by Gemini Flash for professional language optimization</p>
                </div>

                {/* Recent Activity */}
                <div className="p-5 md:p-6 glass rounded-2xl text-left">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-600 dark:bg-accent-600/30 flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-accent-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">Quick Access</h3>
                    <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">Your recent resumes will appear here</p>
                </div>
            </div>

            {/* Recent Resumes (placeholder) */}
            <div>
                <h2 className="text-xl font-bold mb-4">Recent Resumes</h2>
                <div className="glass rounded-2xl p-8 text-center">
                    <FileText className="w-12 h-12 text-text-light-secondary/30 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-text-light-secondary dark:text-gray-400 mb-4">No resumes yet. Create your first one!</p>
                    <button
                        onClick={handleStartNewResume}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Resume
                    </button>
                </div>
            </div>
        </>
    )

    // Main Dashboard Layout
    return (
        <div className="min-h-screen animated-bg flex">
            {/* Toast */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-slide-up">
                    <div className="glass px-6 py-4 rounded-xl flex items-center gap-3 glow-teal">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-dark-950/80 backdrop-blur-lg border-b border-light-200 dark:border-dark-700 px-4 py-3 flex items-center justify-between">
                <Logo className="h-8" textColor="text-text-light-primary dark:text-white" />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="p-2 rounded-lg bg-light-100 dark:bg-dark-800"
                    >
                        {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/50"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40
                ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${sidebarOpen ? 'w-64' : 'w-20'} 
                bg-white dark:bg-dark-950 md:bg-light-100/50 md:dark:bg-dark-900/50 
                border-r border-light-200 dark:border-dark-700 
                flex flex-col transition-all duration-300
            `}>
                {/* Logo */}
                <div className="p-4 md:p-6 border-b border-light-200 dark:border-dark-700 hidden md:block">
                    <Link to="/" className="flex items-center gap-3">
                        <Logo className="h-8" showText={sidebarOpen} textColor="text-text-light-primary dark:text-white" />
                    </Link>
                </div>

                {/* Theme Toggle (Desktop) */}
                <div className="p-4 hidden md:block">
                    <ThemeToggle className="w-full justify-center" />
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon
                        const isActive = activeNav === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                        ? 'bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400'
                                        : 'text-text-light-secondary dark:text-gray-400 hover:bg-light-100 dark:hover:bg-dark-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="flex-1 text-left">{item.label}</span>
                                )}
                                {sidebarOpen && item.locked && (
                                    <Lock className="w-4 h-4 text-amber-500" />
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-light-200 dark:border-dark-700">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-text-light-primary dark:text-white">{displayName}</p>
                                <p className="text-xs text-text-light-secondary dark:text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-text-light-secondary dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-2"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto mt-16 md:mt-0">
                {currentView === VIEWS.LINKEDIN && renderLinkedInView()}
                {currentView === VIEWS.PORTFOLIO && renderPortfolioView()}
                {currentView === VIEWS.HOME && renderHomeView()}
            </main>
        </div>
    )
}
