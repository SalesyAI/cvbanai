import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, Shield, ArrowRight, Check, Star, Linkedin, Globe } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="min-h-screen animated-bg overflow-hidden">
            {/* Navigation */}
            <nav className="py-4 px-6 md:px-8 border-b border-light-200 dark:border-dark-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo className="h-9 group-hover:scale-105 transition-transform duration-300" textColor="text-text-light-primary dark:text-white" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/auth"
                            className="hidden sm:block text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors link-underline"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=signup"
                            className="px-4 py-2 md:px-5 md:py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-16 md:py-24 px-6 md:px-8 relative">
                {/* Background particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-40 right-20 w-3 h-3 bg-accent-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-primary-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent-400/30 rounded-full animate-float-slow" style={{ animationDelay: '0.5s' }}></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400 animate-pulse" />
                        <span className="text-sm text-text-light-secondary dark:text-gray-300">AI-Powered Resume Enhancement</span>
                    </div>

                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Build Resumes That
                        <span className="block gradient-text animate-gradient-shift bg-[length:200%_auto]">Get You Hired</span>
                    </h1>

                    <p className={`text-lg md:text-xl text-text-light-secondary dark:text-gray-400 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Transform your career story into a powerful, ATS-optimized resume with our AI refinement engine.
                    </p>

                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Link
                            to="/auth?mode=signup"
                            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold text-lg transition-all glow-teal hover:-translate-y-1 hover:shadow-xl active:scale-95"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/auth"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-light-100 dark:bg-dark-800 hover:bg-light-200 dark:hover:bg-dark-700 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white font-semibold text-lg transition-all hover:-translate-y-1 active:scale-95"
                        >
                            Login to Dashboard
                        </Link>
                    </div>

                    {/* Trust indicators with stagger */}
                    <div className={`mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-text-light-secondary dark:text-gray-500 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        {['No credit card required', 'ATS-optimized', 'Powered by Gemini AI'].map((text, i) => (
                            <div key={i} className="flex items-center gap-2 stagger-item" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                                <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4">
                            Everything You Need to Land Your Dream Job
                        </h2>
                        <p className="text-text-light-secondary dark:text-gray-400 max-w-2xl mx-auto">
                            Our AI-powered platform transforms ordinary resumes into interview-winning documents.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { icon: Sparkles, color: 'bg-primary-500 dark:bg-primary-400/20', iconColor: 'text-white dark:text-primary-400', title: 'AI Enhancement', desc: 'Gemini-powered AI transforms weak language into powerful, action-oriented statements.' },
                            { icon: Zap, color: 'bg-accent-500 dark:bg-accent-400/20', iconColor: 'text-white dark:text-accent-400', title: 'ATS Optimized', desc: 'Beat tracking systems with properly formatted resumes that get past the bots.' },
                            { icon: Shield, color: 'bg-accent-600 dark:bg-accent-600/30', iconColor: 'text-white dark:text-accent-400', title: 'Secure & Private', desc: 'Your data is encrypted and secure. We never share your information.' },
                        ].map((feature, i) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={i}
                                    className="group p-6 md:p-8 glass rounded-2xl hover:glow-teal transition-all duration-500 card-hover stagger-item"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                >
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <Icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">{feature.title}</h3>
                                    <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">{feature.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section - 4 Tiers */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-10 md:mb-12">
                        Start for free, upgrade when you need more features.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {/* Free Tier */}
                        <div className="group p-5 glass rounded-2xl text-left hover:-translate-y-2 transition-all duration-300 stagger-item">
                            <div className="w-10 h-10 rounded-lg bg-accent-500 dark:bg-accent-400/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Sparkles className="w-5 h-5 text-white dark:text-accent-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">AI Resume Copy</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">Generate professional text</p>
                            <div className="text-2xl font-extrabold mb-4">Free</div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Upload CV or input details</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> AI-powered generation</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Copy to clipboard</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get Started
                            </Link>
                        </div>

                        {/* PDF Tier */}
                        <div className="group p-5 gradient-border rounded-2xl text-left relative hover:-translate-y-2 transition-all duration-300 stagger-item" style={{ animationDelay: '0.1s' }}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-400 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse-slow">
                                    <Star className="w-3 h-3" /> POPULAR
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary-500 dark:bg-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Professional PDF</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">ATS-optimized format</p>
                            <div className="text-2xl font-extrabold mb-4">200 <span className="text-base font-normal text-text-light-secondary dark:text-gray-400">tk</span></div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Everything in Free</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> High-design PDF export</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> ATS-optimized layout</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-primary-500 dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get PDF
                            </Link>
                        </div>

                        {/* LinkedIn Tier */}
                        <div className="group p-5 glass rounded-2xl text-left hover:-translate-y-2 transition-all duration-300 stagger-item" style={{ animationDelay: '0.2s' }}>
                            <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Linkedin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">LinkedIn Optimizer</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">Boost profile visibility</p>
                            <div className="text-2xl font-extrabold mb-4">500 <span className="text-base font-normal text-text-light-secondary dark:text-gray-400">tk</span></div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Full profile optimization</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Personalized strategy</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Networking tips</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get LinkedIn
                            </Link>
                        </div>

                        {/* Portfolio Tier */}
                        <div className="group p-5 glass rounded-2xl text-left hover:-translate-y-2 transition-all duration-300 stagger-item" style={{ animationDelay: '0.3s' }}>
                            <div className="w-10 h-10 rounded-lg bg-accent-600 dark:bg-accent-600/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Ultimate Portfolio</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">Your own website</p>
                            <div className="text-2xl font-extrabold mb-4">1000 <span className="text-base font-normal text-text-light-secondary dark:text-gray-400">tk</span></div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> One-page portfolio site</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Showcase projects</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Hosted & shareable</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get Portfolio
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50 relative overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-breathe"></div>
                </div>

                <div className="max-w-3xl mx-auto text-center relative">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-8">
                        Join thousands of professionals who've upgraded their careers with CVBanai.
                    </p>
                    <Link
                        to="/auth?mode=signup"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold text-lg transition-all glow-teal hover:-translate-y-1 hover:shadow-xl active:scale-95"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 md:py-8 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <Logo className="h-6 hover:scale-105 transition-transform" textColor="text-text-light-primary dark:text-white" />
                    <p className="text-sm text-text-light-secondary dark:text-gray-500">
                        © 2026 CVBanai. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
