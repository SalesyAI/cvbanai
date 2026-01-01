import { ArrowLeft, Check, Crown, FileText, Linkedin, Globe, Sparkles } from 'lucide-react'

const PRICING_TIERS = [
    {
        id: 'free',
        name: 'AI Resume Copy',
        price: 'Free',
        description: 'Get professional resume text instantly',
        features: [
            'Upload old CV or input details',
            'AI-powered professional text generation',
            'Copy to clipboard instantly',
            'Unlimited usage',
        ],
        icon: Sparkles,
        popular: false,
        isFree: true,
    },
    {
        id: 'pdf',
        name: 'Professional PDF',
        price: 200,
        currency: 'tk',
        description: 'ATS-optimized, high-design format',
        features: [
            'Everything in Free',
            'Tailored, ATS-optimized PDF template',
            'High-design professional layout',
            'Ready for job applications',
        ],
        icon: FileText,
        popular: true,
    },
    {
        id: 'linkedin',
        name: 'LinkedIn Optimizer',
        price: 500,
        currency: 'tk',
        description: 'Boost your profile visibility',
        features: [
            'Full LinkedIn profile optimization',
            'Personalized strategy guide',
            'Networking tips & templates',
            'Visibility improvement tactics',
        ],
        icon: Linkedin,
        popular: false,
    },
    {
        id: 'portfolio',
        name: 'Ultimate Portfolio',
        price: 1000,
        currency: 'tk',
        description: 'Your own professional website',
        features: [
            'Custom one-page portfolio website',
            'Showcase projects & experience',
            'Professional personal branding',
            'Hosted & ready to share',
        ],
        icon: Globe,
        popular: false,
    },
]

export default function PricingScreen({ onBack }) {
    const handleSelectPlan = (tier) => {
        if (tier.isFree) {
            onBack() // Go back to editor for free tier
        } else {
            // In a real app, this would redirect to payment
            alert(`Selected: ${tier.name} - ${tier.price} ${tier.currency || ''}\n\nPayment integration would go here!`)
        }
    }

    return (
        <div className="min-h-screen animated-bg flex flex-col">
            {/* Header */}
            <header className="py-6 px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Editor
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Header */}
                    <div className="mb-10 md:mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                            <Crown className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-text-light-secondary dark:text-gray-300">Unlock Premium Features</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                            Your Resume is Ready.
                            <span className="block gradient-text">Choose Your Package.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-text-light-secondary dark:text-gray-400 max-w-2xl mx-auto">
                            Take your career to the next level with our premium services.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                        {PRICING_TIERS.map((tier, index) => {
                            const Icon = tier.icon
                            return (
                                <div
                                    key={tier.id}
                                    className={`relative p-5 md:p-6 rounded-2xl text-left transition-all duration-500 animate-slide-up hover:scale-[1.02] ${tier.popular
                                            ? 'gradient-border glow-teal'
                                            : 'glass hover:glow-teal'
                                        }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Popular Badge */}
                                    {tier.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                POPULAR
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 ${tier.popular
                                            ? 'bg-primary-500 dark:bg-primary-400'
                                            : tier.isFree
                                                ? 'bg-accent-500 dark:bg-accent-400/20'
                                                : 'bg-light-200 dark:bg-dark-700'
                                        }`}>
                                        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${tier.popular || tier.isFree ? 'text-white dark:text-white' : 'text-text-light-primary dark:text-white'
                                            }`} />
                                    </div>

                                    {/* Title & Price */}
                                    <h3 className="text-lg md:text-xl font-bold mb-1">{tier.name}</h3>
                                    <p className="text-text-light-secondary dark:text-gray-400 text-sm mb-4">{tier.description}</p>

                                    <div className="mb-5">
                                        <span className="text-3xl md:text-4xl font-extrabold">
                                            {typeof tier.price === 'number' ? tier.price : tier.price}
                                        </span>
                                        {tier.currency && <span className="text-text-light-secondary dark:text-gray-400 ml-1">{tier.currency}</span>}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-2 md:space-y-3 mb-6">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-primary-500 dark:text-primary-400' : 'text-accent-400'
                                                    }`} />
                                                <span className="text-text-light-secondary dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSelectPlan(tier)}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all text-sm md:text-base ${tier.popular
                                                ? 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 text-white'
                                                : tier.isFree
                                                    ? 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600'
                                                    : 'bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600'
                                            }`}
                                    >
                                        {tier.isFree ? 'Continue Free' : `Get ${tier.name.split(' ')[0]}`}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Trust / Guarantee */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-text-light-secondary dark:text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>Instant Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-8 border-t border-light-200 dark:border-dark-700">
                <div className="max-w-7xl mx-auto text-center text-sm text-text-light-secondary dark:text-gray-500">
                    <p>Questions? Contact us at support@cvbanai.com</p>
                </div>
            </footer>
        </div>
    )
}
