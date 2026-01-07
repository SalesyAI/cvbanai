import { useState } from 'react'
import { Globe, X, MessageCircle, Check, Loader2, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PortfolioWhatsAppModal({ isOpen, onClose, hasPurchased = false, onRequestPayment }) {
    const { session, user } = useAuth()
    const [whatsapp, setWhatsapp] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    if (!isOpen) return null

    // If user hasn't purchased, show payment required
    if (!hasPurchased) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="glass rounded-2xl max-w-md w-full p-8 text-center animate-scale-in">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Payment Required</h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-6">
                        Please purchase Portfolio Website to proceed.
                    </p>
                    <button
                        onClick={onRequestPayment}
                        className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all mb-3"
                    >
                        Purchase Now (1000 TK) <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-text-light-secondary dark:text-gray-500 hover:text-text-light-primary dark:hover:text-white text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/portfolio-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ whatsapp, userId: user?.id })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit')
            }

            setSubmitted(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Success state
    if (submitted) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="glass rounded-2xl max-w-md w-full p-8 text-center animate-scale-in">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Order Confirmed! 🎉</h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-6">
                        Our team will contact you on WhatsApp within 24 hours to discuss your portfolio website.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-semibold transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass rounded-2xl max-w-md w-full p-6 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Portfolio Website</h2>
                            <p className="text-xs text-text-light-secondary dark:text-gray-400">Purchased Successfully!</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-light-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Message */}
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-6">
                    <p className="text-sm text-text-light-primary dark:text-gray-200">
                        🎊 <strong>Congratulations!</strong> Your portfolio website is being crafted by our expert designers.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium mb-2">
                        Enter your WhatsApp number for updates
                    </label>
                    <div className="relative mb-4">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-gray-500" />
                        <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            placeholder="+880 1XXX-XXXXXX"
                            className="w-full pl-11 pr-4 py-3 bg-light-100 dark:bg-dark-800 border border-light-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !whatsapp.trim()}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                        ) : (
                            <><MessageCircle className="w-5 h-5" /> Submit & Get Contacted</>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-text-light-secondary dark:text-gray-500 mt-4">
                    We'll reach out within 24 hours to discuss your vision.
                </p>
            </div>
        </div>
    )
}
