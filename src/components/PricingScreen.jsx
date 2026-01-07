import { ArrowLeft, Check, Crown, FileText, Linkedin, Globe, Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const PRICING_TIERS = [
    {
        id: 'free',
        name: 'AI Resume Copy',
        subtitle: 'Get professional resume text instantly',
        price: 'Free',
        features: [
            'Upload old CV or input details',
            'AI-powered professional text generation',
            'Copy to clipboard instantly',
            'Unlimited usage',
        ],
        icon: Sparkles,
        popular: false,
        isFree: true,
        buttonText: 'Continue Free',
    },
    {
        id: 'pdf',
        name: 'Professional PDF',
        subtitle: 'ATS-optimized, high-design format',
        price: 200,
        currency: 'tk',
        features: [
            'Everything in Free',
            'Tailored, ATS-optimized PDF template',
            'High-design professional layout',
            'Ready for job applications',
        ],
        icon: FileText,
        popular: true,
        buttonText: 'Pay with bKash',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Optimizer',
        subtitle: 'Boost your profile visibility',
        price: 500,
        currency: 'tk',
        features: [
            'Full LinkedIn profile optimization',
            'Personalized strategy guide',
            'Networking tips & templates',
            'Visibility improvement tactics',
        ],
        icon: Linkedin,
        popular: false,
        buttonText: 'Pay with bKash',
    },
    {
        id: 'portfolio',
        name: 'Ultimate Portfolio',
        subtitle: 'Your own professional website',
        price: 1000,
        currency: 'tk',
        features: [
            'Custom one-page portfolio website',
            'Showcase projects & experience',
            'Professional personal branding',
            'Hosted & ready to share',
        ],
        icon: Globe,
        popular: false,
        buttonText: 'Pay with bKash',
    },
]

export default function PricingScreen({ onBack, resumeId }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(null) // Track which tier is loading
    const [error, setError] = useState(null)

    const handleSelectPlan = async (tier) => {
        if (tier.isFree) {
            onBack()
            return
        }

        if (!user) {
            setError('Please log in to make a purchase')
            return
        }

        setLoading(tier.id)
        setError(null)

        try {
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: tier.id,
                    userId: user.id,
                    resumeId
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Payment creation failed')
            }

            // Redirect to bKash payment page
            window.location.href = data.bkashURL

        } catch (err) {
            console.error('Payment error:', err)
            setError(err.message || 'Payment failed. Please try again.')
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen animated-bg flex flex-col">
            {/* Header */}
            <header className="py-4 px-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Editor
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="max-w-5xl mx-auto text-center w-full">
                    {/* Header */}
                    <div className="mb-10 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-5">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs text-text-light-secondary dark:text-gray-300">Unlock Premium Features</span>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
                            Your Resume is Ready.
                            <span className="block gradient-text">Choose Your Package.</span>
                        </h1>

                        <p className="text-text-light-secondary dark:text-gray-400 max-w-lg mx-auto">
                            Take your career to the next level with our premium services.
                        </p>
                    </div>

                    {/* Pricing Cards - Fixed alignment */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {PRICING_TIERS.map((tier, index) => {
                            const Icon = tier.icon
                            return (
                                <div
                                    key={tier.id}
                                    className={`group relative rounded-2xl text-left transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 flex flex-col stagger-item ${tier.popular
                                        ? 'gradient-border hover:glow-teal'
                                        : 'glass hover:glow-mint'
                                        }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Popular Badge */}
                                    {tier.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-400 text-white text-xs font-bold rounded-full flex items-center gap-1 whitespace-nowrap animate-pulse-slow">
                                                <Check className="w-3 h-3" />
                                                POPULAR
                                            </span>
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${tier.popular
                                            ? 'bg-primary-500 dark:bg-primary-400'
                                            : tier.isFree
                                                ? 'bg-accent-500 dark:bg-accent-400/20'
                                                : tier.id === 'linkedin'
                                                    ? 'bg-[#0A66C2]'
                                                    : 'bg-accent-600 dark:bg-accent-600/50'
                                            }`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-bold mb-1">{tier.name}</h3>

                                        {/* Subtitle - Fixed height */}
                                        <p className="text-text-light-secondary dark:text-gray-500 text-xs mb-4 h-8 line-clamp-2">
                                            {tier.subtitle}
                                        </p>

                                        {/* Price - Fixed height */}
                                        <div className="mb-5 h-10 flex items-baseline">
                                            <span className="text-3xl font-extrabold">
                                                {tier.price}
                                            </span>
                                            {tier.currency && (
                                                <span className="text-text-light-secondary dark:text-gray-400 text-sm ml-1">{tier.currency}</span>
                                            )}
                                        </div>

                                        {/* Features - Fixed min-height for alignment */}
                                        <ul className="space-y-2.5 mb-6 flex-1 min-h-[140px]">
                                            {tier.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-primary-500 dark:text-primary-400' : 'text-accent-400'
                                                        }`} />
                                                    <span className="text-text-light-secondary dark:text-gray-300 text-xs leading-relaxed">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button - Always at bottom */}
                                        <button
                                            onClick={() => handleSelectPlan(tier)}
                                            disabled={loading === tier.id}
                                            className={`w-full py-2.5 rounded-xl font-semibold transition-all text-sm hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 ${tier.popular
                                                ? 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white'
                                                : 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 text-text-light-primary dark:text-white'
                                                }`}
                                        >
                                            {loading === tier.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                tier.buttonText
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-text-light-secondary dark:text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-500 dark:text-accent-400" />
                            <span>bKash Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-500 dark:text-accent-400" />
                            <span>Instant Delivery</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-primary-500 dark:text-accent-400" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 px-6 border-t border-light-200 dark:border-dark-700">
                <div className="max-w-6xl mx-auto text-center text-xs text-text-light-secondary dark:text-gray-500">
                    <p>Questions? Contact us at support@cvbanai.com</p>
                </div>
            </footer>
        </div>
    )
}
