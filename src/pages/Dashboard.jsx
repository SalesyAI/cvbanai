import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FileText, Plus, LogOut, User, Settings, Home,
    ChevronRight, Sparkles, Clock, MoreVertical
} from 'lucide-react'

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
}

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const [currentView, setCurrentView] = useState(VIEWS.HOME)
    const [resumeData, setResumeData] = useState(null)
    const [refinedData, setRefinedData] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // Get user display name
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'


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
            // Fallback to simulated refinement for demo
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
                        <div className="absolute inset-0 rounded-full border-4 border-dark-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                        <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Refining with Gemini AI<span className="loading-dots"></span></h2>
                    <p className="text-gray-400">Enhancing your resume with professional language</p>
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

    // Main Dashboard Home View
    return (
        <div className="min-h-screen animated-bg flex">
            {/* Toast */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50 animate-slide-up">
                    <div className="glass px-6 py-4 rounded-xl flex items-center gap-3 glow-violet">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} glass-dark border-r border-dark-700 flex flex-col transition-all duration-300`}>
                {/* Logo */}
                <div className="p-6 border-b border-dark-700">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && <span className="text-xl font-bold">CVBanai</span>}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-500/20 text-primary-300 rounded-xl">
                        <Home className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Dashboard</span>}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 rounded-xl transition-colors">
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>My Resumes</span>}
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-dark-700 rounded-xl transition-colors">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Settings</span>}
                    </button>
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-dark-700">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{displayName}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-2"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName.split(' ')[0]}!</h1>
                    <p className="text-gray-400">Ready to build your next career-winning resume?</p>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Create New Resume */}
                    <button
                        onClick={handleStartNewResume}
                        className="group p-6 gradient-border rounded-2xl text-left hover:glow-violet transition-all duration-500"
                    >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            Create New Resume
                            <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </h3>
                        <p className="text-gray-400">Start fresh with our guided resume builder</p>
                    </button>

                    {/* AI Enhancement */}
                    <div className="p-6 glass rounded-2xl text-left">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
                        <p className="text-gray-400">Powered by Gemini Flash for professional language optimization</p>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-6 glass rounded-2xl text-left">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Quick Access</h3>
                        <p className="text-gray-400">Your recent resumes will appear here</p>
                    </div>
                </div>

                {/* Recent Resumes (placeholder) */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Recent Resumes</h2>
                    <div className="glass rounded-2xl p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No resumes yet. Create your first one!</p>
                        <button
                            onClick={handleStartNewResume}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-medium transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Resume
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
