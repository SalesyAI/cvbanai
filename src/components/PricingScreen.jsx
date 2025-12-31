import { ArrowLeft, Check, Crown, FileText, Linkedin, Globe, Sparkles } from 'lucide-react'

const PRICING_TIERS = [
    {
        id: 'pro',
        name: 'Pro Resume Export',
        price: 200,
        currency: 'tk',
        description: 'Perfect for job applications',
        features: [
            'High-ATS optimized PDF template',
            'AI-refined professional copy',
            'Multiple download formats',
            'Email delivery',
        ],
        icon: FileText,
        popular: false,
    },
    {
        id: 'bundle',
        name: 'Job-Hunter Bundle',
        price: 500,
        currency: 'tk',
        description: 'Complete job search toolkit',
        features: [
            'Everything in Pro Resume Export',
            'LinkedIn Profile Optimization Guide',
            'Cover Letter Templates',
            'Interview Prep Checklist',
        ],
        icon: Linkedin,
        popular: true,
    },
    {
        id: 'executive',
        name: 'Executive Presence',
        price: 1000,
        currency: 'tk',
        description: 'Stand out from the competition',
        features: [
            'Everything in Job-Hunter Bundle',
            'Custom One-Page Portfolio Website',
            'Personal Branding Guide',
            'Priority Support',
        ],
        icon: Globe,
        popular: false,
    },
]

export default function PricingScreen({ onBack }) {
    const handleSelectPlan = (tier) => {
        // In a real app, this would redirect to payment
        alert(`Selected: ${tier.name} - ${tier.price} ${tier.currency}\n\nPayment integration would go here!`)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="py-6 px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Editor
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Header */}
                    <div className="mb-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-sm text-gray-300">Unlock Premium Features</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Your Resume is Ready.
                            <span className="block gradient-text">Choose Your Package.</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Get your professionally enhanced resume in a beautiful, ATS-friendly format.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {PRICING_TIERS.map((tier, index) => {
                            const Icon = tier.icon
                            return (
                                <div
                                    key={tier.id}
                                    className={`relative p-6 rounded-2xl text-left transition-all duration-500 animate-slide-up hover:scale-105 ${tier.popular
                                            ? 'gradient-border glow-violet'
                                            : 'glass hover:glow-cyan'
                                        }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Popular Badge */}
                                    {tier.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                MOST POPULAR
                                            </span>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tier.popular
                                            ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                                            : 'bg-dark-700'
                                        }`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Title & Price */}
                                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{tier.description}</p>

                                    <div className="mb-6">
                                        <span className="text-4xl font-extrabold">{tier.price}</span>
                                        <span className="text-gray-400 ml-1">{tier.currency}</span>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <Check className={`w-5 h-5 flex-shrink-0 ${tier.popular ? 'text-primary-400' : 'text-green-400'
                                                    }`} />
                                                <span className="text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleSelectPlan(tier)}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all ${tier.popular
                                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                                                : 'bg-dark-700 hover:bg-dark-600 text-white'
                                            }`}
                                    >
                                        Select {tier.name.split(' ')[0]}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Trust / Guarantee */}
                    <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Instant Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-8 border-t border-dark-700">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
                    <p>Questions? Contact us at support@cvbanai.com</p>
                </div>
            </footer>
        </div>
    )
}
