import { useState } from 'react'
import { X, FileText, Loader2, Shield, Clock, Sparkles, Linkedin, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * PaymentModal - Simplified inline payment modal for PDF purchase
 * Shows focused payment UI instead of full pricing page
 */
export default function PaymentModal({ isOpen, onClose, onSuccess, productId = 'pdf', resumeId }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Product details
    const products = {
        pdf: {
            name: 'Professional PDF Resume',
            price: 200,
            icon: FileText,
            benefits: [
                'ATS-optimized format',
                'Professional design',
                'Instant download'
            ]
        },
        linkedin: {
            name: 'LinkedIn Optimization',
            price: 500,
            icon: Linkedin,
            benefits: [
                'Complete profile rewrite',
                'Networking strategy',
                'Recruiter visibility boost'
            ]
        },
        portfolio: {
            name: 'Ultimate Portfolio Builder',
            price: 1000,
            icon: Globe,
            benefits: [
                'Custom website URL',
                'Modern responsive design',
                'Free hosting included'
            ]
        }
    }

    const product = products[productId]

    const handlePayment = async () => {
        if (!user) {
            setError('Please log in to make a purchase')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userId: user.id,
                    resumeId // Pass resumeId to maintain context after redirect
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Payment creation failed')
            }

            // Redirect to bKash
            window.location.href = data.bkashURL

        } catch (err) {
            console.error('Payment error:', err)
            setError(err.message || 'Payment failed. Please try again.')
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const Icon = product.icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden animate-scale">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{product.name}</h2>
                            <p className="text-white/80 text-sm">One-time purchase</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Price */}
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-text-light-primary dark:text-white">
                            ৳{product.price}
                        </div>
                        <p className="text-text-light-secondary dark:text-gray-400 text-sm mt-1">
                            Bangladeshi Taka
                        </p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-3 mb-6">
                        {product.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm">
                                <Sparkles className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span className="text-text-light-primary dark:text-gray-300">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 dark:text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:opacity-70 disabled:cursor-wait text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <img
                                    src="https://www.bkash.com/sites/all/themes/flavor/images/logo.png"
                                    alt="bKash"
                                    className="h-5 brightness-0 invert"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                                Pay with bKash
                            </>
                        )}
                    </button>

                    {/* Trust signals */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-text-light-secondary dark:text-gray-500">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Instant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
