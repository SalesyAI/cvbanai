import { CheckCircle, XCircle, RefreshCw, Sparkles, Linkedin, Globe, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * PaymentSuccessModal - Shows after bKash payment redirect
 * Displays success/failure state with product-specific messaging
 */
export default function PaymentSuccessModal({
    isOpen,
    status, // 'success' | 'failed' | 'cancelled'
    trxID,
    errorMessage,
    onClose,
    onContinue,
    productId // 'linkedin' | 'portfolio'
}) {
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (isOpen && status === 'success') {
            setShowConfetti(true)
        }
    }, [isOpen, status])

    if (!isOpen) return null

    const isSuccess = status === 'success'
    const isCancelled = status === 'cancelled'

    // Product-specific content
    const productContent = {
        linkedin: {
            icon: Linkedin,
            iconColor: 'text-[#0A66C2]',
            title: 'LinkedIn Optimizer Unlocked!',
            description: 'You can now generate your optimized LinkedIn profile.',
            buttonText: 'Start Optimization',
            buttonColor: 'bg-[#0A66C2] hover:bg-[#0958a8]'
        },
        portfolio: {
            icon: Globe,
            iconColor: 'text-primary-500',
            title: 'Portfolio Website Purchased!',
            description: 'Please provide your WhatsApp number so we can contact you.',
            buttonText: 'Continue',
            buttonColor: 'bg-primary-500 hover:bg-primary-600'
        }
    }

    const content = productContent[productId] || productContent.linkedin

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Confetti effect for success */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: ['#2DD4BF', '#14B8A6', '#5EEAD4', '#FFD700', '#FF6B6B'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden animate-scale">
                {/* Icon */}
                <div className={`p-8 flex flex-col items-center ${isSuccess ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {isSuccess ? (
                        <CheckCircle className="w-20 h-20 text-green-500 animate-bounce-soft" />
                    ) : (
                        <XCircle className="w-20 h-20 text-red-500" />
                    )}
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h2 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isSuccess ? content.title : isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
                    </h2>

                    {isSuccess && trxID && (
                        <p className="text-text-light-secondary dark:text-gray-400 text-sm mb-4">
                            Transaction ID: <span className="font-mono">{trxID}</span>
                        </p>
                    )}

                    {!isSuccess && errorMessage && (
                        <p className="text-text-light-secondary dark:text-gray-400 text-sm mb-4">
                            {errorMessage}
                        </p>
                    )}

                    {isSuccess ? (
                        <div className="space-y-3">
                            <p className="text-text-light-secondary dark:text-gray-400 text-sm flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary-500" />
                                {content.description}
                            </p>
                            <button
                                onClick={onContinue}
                                className={`w-full py-3 ${content.buttonColor} text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2`}
                            >
                                {content.buttonText} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={onContinue}
                                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 text-text-light-primary dark:text-white font-medium rounded-xl transition-all"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

