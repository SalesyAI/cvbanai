import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, Shield, ArrowRight, Check, Star, Linkedin, Globe, MessageCircle } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="min-h-screen mesh-gradient mesh-animate overflow-x-hidden selection:bg-teal-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 border-b border-light-200/50 dark:border-dark-700/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo className="h-8 md:h-9 group-hover:scale-105 transition-transform duration-300" textColor="text-text-light-primary dark:text-white" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/auth"
                            className="hidden sm:block text-sm font-medium text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=signup"
                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-8 relative z-10">
                <div className="max-w-5xl mx-auto text-center relative">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        <span className="text-xs font-semibold tracking-wide uppercase text-text-light-secondary dark:text-gray-300">The Complete Career Ecosystem</span>
                    </div>

                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Your Career Path, <br className="hidden md:block" />
                        <span className="gradient-text">Accelerated by AI.</span>
                    </h1>

                    <p className={`text-lg md:text-xl text-text-light-secondary dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        Build a professional resume for free. Then upgrade to automate your LinkedIn presence and launch a custom portfolio.
                    </p>

                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Link
                            to="/auth?mode=signup"
                            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 active:scale-95"
                        >
                            Build Resume Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/pricing"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 glass-card hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl text-text-light-primary dark:text-white font-semibold text-lg transition-all hover:-translate-y-1 active:scale-95 backdrop-blur-md"
                        >
                            Explore Premium
                        </Link>
                    </div>

                    <p className={`mt-8 text-sm text-text-light-secondary dark:text-gray-500 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        Join 10,000+ professionals landing jobs at top tech companies.
                    </p>
                </div>
            </section>

            {/* Bento Grid Features Section */}
            <section className="py-20 px-6 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-text-light-secondary dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            From your first application to your personal brand, we've got you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6 h-auto md:h-[600px]">

                        {/* 1. HERO CARD: AI Resume Builder (Large) */}
                        <div className="col-span-1 md:col-span-2 row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-all duration-500"></div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center mb-6">
                                        <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3">AI Resume Builder</h3>
                                    <p className="text-text-light-secondary dark:text-gray-400 text-base md:text-lg max-w-md">
                                        Instant AI text refinement, ATS optimization, and professional templates.
                                        <span className="block mt-2 font-semibold text-primary-600 dark:text-primary-400">100% Free Forever.</span>
                                    </p>
                                </div>
                                <div className="mt-8 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10 h-full"></div>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm opacity-80 border border-slate-100 dark:border-slate-700/50 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                        <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-700/50 rounded mb-2"></div>
                                        <div className="h-2 w-4/5 bg-slate-100 dark:bg-slate-700/50 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. LINKEDIN CARD (Tall) */}
                        <div className="col-span-1 md:col-span-1 row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group md:order-none order-2">
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0A66C2]/10 to-transparent"></div>
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-2xl bg-[#0A66C2]/10 flex items-center justify-center mb-6">
                                    <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2">LinkedIn Optimizer</h3>
                                <p className="text-sm text-text-light-secondary dark:text-gray-400 mb-6">Automated profile makeover to rank higher in recruiter searches.</p>

                                <div className="mt-auto flex justify-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 flex items-center justify-center">
                                            <span className="text-2xl font-bold opacity-50">You</span>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white dark:border-slate-800">
                                            ALL STAR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. PORTFOLIO CARD (Wide) */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1 row-span-1 glass-card rounded-3xl p-6 relative overflow-hidden group md:order-none order-3">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-md">Premier</span>
                                </div>
                                <h3 className="text-lg font-bold mb-2">Custom Portfolio</h3>
                                <p className="text-sm text-text-light-secondary dark:text-gray-400">
                                    We build your personal website manually. Stand out from the crowd.
                                </p>
                            </div>
                        </div>

                        {/* 4. ATS SCORE (Small) */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 glass-card rounded-3xl p-6 flex flex-col justify-center items-center relative group md:order-none order-4">
                            <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mb-1">98%</div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-light-secondary dark:text-gray-500">ATS Score</p>
                            </div>
                        </div>

                        {/* 5. WHATSAPP SUPPORT (Small) */}
                        <div className="col-span-1 md:col-span-1 lg:col-span-1 md:col-start-2 lg:col-start-auto row-span-1 glass-card rounded-3xl p-6 flex flex-col justify-center items-center relative group md:order-none order-5">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                                    <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-sm font-medium text-text-light-secondary dark:text-gray-400">Direct Support</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Pricing Section - 4 Tiers */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Free Resume Builder. Premium Career Tools.
                    </h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-10 md:mb-12">
                        Build unlimited resumes with PDF export for free. Upgrade for LinkedIn optimization and custom portfolio websites.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Free Tier */}
                        <div className="group p-6 glass rounded-2xl text-left hover:-translate-y-2 transition-all duration-300 stagger-item">
                            <div className="w-10 h-10 rounded-lg bg-accent-500 dark:bg-accent-400/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Sparkles className="w-5 h-5 text-white dark:text-accent-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">AI Resume Builder</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">Complete resume + PDF export</p>
                            <div className="text-2xl font-extrabold mb-4">Free</div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> AI-powered text refinement</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Professional PDF export</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> ATS-optimized format</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Unlimited resumes</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-primary-500 dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Start Building Free
                            </Link>
                        </div>

                        {/* LinkedIn Tier - POPULAR */}
                        <div className="group p-6 gradient-border rounded-2xl text-left relative hover:-translate-y-2 transition-all duration-300 stagger-item" style={{ animationDelay: '0.1s' }}>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-gradient-to-r from-[#0A66C2] to-primary-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse-slow">
                                    <Star className="w-3 h-3" /> POPULAR
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Linkedin className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">LinkedIn Optimizer</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">AI-powered profile enhancement</p>
                            <div className="text-2xl font-extrabold mb-4">500 <span className="text-base font-normal text-text-light-secondary dark:text-gray-400">tk</span></div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> AI-generated headline & summary</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Experience optimization</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Networking strategy guide</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Instant AI delivery</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-[#0A66C2] hover:bg-[#0958a8] rounded-xl text-white font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get LinkedIn Optimizer
                            </Link>
                        </div>

                        {/* Portfolio Tier */}
                        <div className="group p-6 glass rounded-2xl text-left hover:-translate-y-2 transition-all duration-300 stagger-item" style={{ animationDelay: '0.2s' }}>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Portfolio Website</h3>
                            <p className="text-xs text-text-light-secondary dark:text-gray-500 mb-3">Your own professional site</p>
                            <div className="text-2xl font-extrabold mb-4">1000 <span className="text-base font-normal text-text-light-secondary dark:text-gray-400">tk</span></div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-5">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Custom one-page design</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Mobile responsive</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Free hosting included</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> 24hr delivery</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-2.5 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all text-sm hover:scale-[1.02] active:scale-95">
                                Get Portfolio Website
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
