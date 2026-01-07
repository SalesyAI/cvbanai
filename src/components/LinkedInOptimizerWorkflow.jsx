import { useState, useEffect } from 'react'
import { Linkedin, ArrowRight, ArrowLeft, Check, Copy, Loader2, Sparkles, CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const QUESTIONS = [
    { id: 'targetIndustry', label: 'What industry are you targeting?', placeholder: 'e.g., Tech, Finance, Healthcare' },
    { id: 'careerGoal', label: 'What is your main career goal right now?', placeholder: 'e.g., Land a senior role, Switch to product management' },
    { id: 'keySkills', label: 'List 3-5 of your strongest skills', placeholder: 'e.g., Python, Leadership, Data Analysis' },
    { id: 'biggestAchievement', label: 'What is your biggest professional achievement?', placeholder: 'e.g., Led a team of 10, Increased revenue by 40%' },
    { id: 'idealRole', label: 'Describe your ideal role', placeholder: 'e.g., Remote Product Manager at a growth-stage startup' },
]

export default function LinkedInOptimizerWorkflow({ onBack, hasPurchased = false, onRequestPayment }) {
    const { session } = useAuth()
    const [step, setStep] = useState(0) // 0 = questions, 1 = loading, 2 = results
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState({})
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState({ headline: false, about: false })

    // If user hasn't purchased, show payment required screen
    if (!hasPurchased) {
        return (
            <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Payment Required</h1>
                    <p className="text-text-light-secondary dark:text-gray-400">
                        Please purchase LinkedIn Optimizer to access this feature.
                    </p>
                </div>
                <button
                    onClick={onRequestPayment}
                    className="w-full py-3 bg-[#0A66C2] hover:bg-[#0958a8] rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all mb-4"
                >
                    Purchase Now (500 TK) <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-2 text-text-light-secondary dark:text-gray-500 hover:text-text-light-primary dark:hover:text-white text-sm transition-colors"
                >
                    ← Back to Dashboard
                </button>
            </div>
        )
    }

    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[currentQuestion].id]: value }))
    }

    const handleNext = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            handleSubmit()
        }
    }

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setStep(1)
        setError(null)

        try {
            const response = await fetch('/api/linkedin-optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ answers })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Optimization failed')
            }

            setResult(data)
            setStep(2)
        } catch (err) {
            setError(err.message)
            setStep(0)
        }
    }

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text)
        setCopied(prev => ({ ...prev, [field]: true }))
        setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000)
    }

    // Step 0: Questions
    if (step === 0) {
        const question = QUESTIONS[currentQuestion]
        const currentAnswer = answers[question.id] || ''

        return (
            <div className="max-w-lg mx-auto py-8 px-4 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center mx-auto mb-4">
                        <Linkedin className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">LinkedIn Optimizer</h1>
                    <p className="text-text-light-secondary dark:text-gray-400">
                        Answer a few questions to get your personalized profile
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Progress */}
                <div className="flex gap-1 mb-6">
                    {QUESTIONS.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all ${i <= currentQuestion ? 'bg-[#0A66C2]' : 'bg-light-200 dark:bg-dark-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Question Card */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-2">
                        Question {currentQuestion + 1} of {QUESTIONS.length}
                    </p>
                    <label className="block text-lg font-semibold mb-4">{question.label}</label>
                    <textarea
                        value={currentAnswer}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder={question.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-light-100 dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A66C2] transition-all resize-none"
                    />
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    {currentQuestion > 0 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-3 bg-light-100 dark:bg-dark-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-light-200 dark:hover:bg-dark-600 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!currentAnswer.trim()}
                        className="flex-1 py-3 bg-[#0A66C2] hover:bg-[#0958a8] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                        {currentQuestion === QUESTIONS.length - 1 ? 'Generate Profile' : 'Next'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="w-full mt-4 py-2 text-text-light-secondary dark:text-gray-500 hover:text-text-light-primary dark:hover:text-white text-sm transition-colors"
                >
                    ← Back to Dashboard
                </button>
            </div>
        )
    }

    // Step 1: Loading
    if (step === 1) {
        return (
            <div className="max-w-lg mx-auto py-16 px-4 text-center animate-fade-in-up">
                <div className="w-20 h-20 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-10 h-10 text-[#0A66C2] animate-spin" />
                </div>
                <h2 className="text-xl font-bold mb-2">Crafting Your Profile...</h2>
                <p className="text-text-light-secondary dark:text-gray-400">
                    Our AI is analyzing your answers and creating optimized content.
                </p>
            </div>
        )
    }

    // Step 2: Results
    return (
        <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Your Optimized Profile</h1>
                <p className="text-text-light-secondary dark:text-gray-400">
                    Copy the sections below and paste them into your LinkedIn
                </p>
            </div>

            {/* Headline */}
            <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Headline
                    </h3>
                    <button
                        onClick={() => copyToClipboard(result.headline, 'headline')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${copied.headline ? 'bg-green-500/10 text-green-600' : 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600'
                            }`}
                    >
                        {copied.headline ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied.headline ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <p className="text-lg font-medium text-[#0A66C2]">{result.headline}</p>
            </div>

            {/* About */}
            <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> About Section
                    </h3>
                    <button
                        onClick={() => copyToClipboard(result.about, 'about')}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${copied.about ? 'bg-green-500/10 text-green-600' : 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600'
                            }`}
                    >
                        {copied.about ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied.about ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <p className="text-sm text-text-light-secondary dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {result.about}
                </p>
            </div>

            {/* Experience Bullets */}
            {result.experienceBullets?.length > 0 && (
                <div className="glass rounded-2xl p-6 mb-4">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Experience Bullets
                    </h3>
                    <ul className="space-y-2">
                        {result.experienceBullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-light-secondary dark:text-gray-300">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {bullet}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tips */}
            {result.tips?.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6">
                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-3">💡 Pro Tips</h3>
                    <ul className="space-y-2">
                        {result.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-text-light-secondary dark:text-gray-300">
                                • {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={onBack}
                className="w-full py-3 bg-light-100 dark:bg-dark-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-light-200 dark:hover:bg-dark-600 transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
        </div>
    )
}
