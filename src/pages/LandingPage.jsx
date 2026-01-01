import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, Shield, ArrowRight, Check, Star } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
    return (
        <div className="min-h-screen animated-bg">
            {/* Navigation */}
            <nav className="py-4 px-6 md:px-8 border-b border-light-200 dark:border-dark-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="h-9" textColor="text-text-light-primary dark:text-white" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/auth"
                            className="hidden sm:block text-text-light-secondary dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=signup"
                            className="px-4 py-2 md:px-5 md:py-2.5 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-16 md:py-24 px-6 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        <span className="text-sm text-text-light-secondary dark:text-gray-300">AI-Powered Resume Enhancement</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up leading-tight">
                        Build Resumes That
                        <span className="block gradient-text">Get You Hired</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-light-secondary dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Transform your career story into a powerful, ATS-optimized resume with our AI refinement engine.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/auth?mode=signup"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold text-lg transition-all glow-teal"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/auth"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-light-100 dark:bg-dark-800 hover:bg-light-200 dark:hover:bg-dark-700 border border-light-200 dark:border-dark-700 rounded-xl text-text-light-primary dark:text-white font-semibold text-lg transition-all"
                        >
                            Login to Dashboard
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-text-light-secondary dark:text-gray-500">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>ATS-optimized</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                            <span>Powered by Gemini AI</span>
                        </div>
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
                        {/* Feature 1 */}
                        <div className="p-6 md:p-8 glass rounded-2xl hover:glow-teal transition-all duration-500">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-500 dark:bg-primary-400/20 flex items-center justify-center mb-5 md:mb-6">
                                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-3">AI Enhancement</h3>
                            <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">
                                Gemini-powered AI transforms weak language into powerful, action-oriented statements.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 md:p-8 glass rounded-2xl hover:glow-teal transition-all duration-500">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-500 dark:bg-accent-400/20 flex items-center justify-center mb-5 md:mb-6">
                                <Zap className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-accent-400" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-3">ATS Optimized</h3>
                            <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">
                                Beat tracking systems with properly formatted resumes that get past the bots.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 md:p-8 glass rounded-2xl hover:glow-teal transition-all duration-500">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent-600 dark:bg-accent-600/30 flex items-center justify-center mb-5 md:mb-6">
                                <Shield className="w-6 h-6 md:w-7 md:h-7 text-white dark:text-accent-400" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-3">Secure & Private</h3>
                            <p className="text-text-light-secondary dark:text-gray-400 text-sm md:text-base">
                                Your data is encrypted and secure. We never share your information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-10 md:mb-12">
                        Start for free, upgrade when you need more features.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                        {/* Free Tier */}
                        <div className="p-5 md:p-6 glass rounded-2xl text-left">
                            <h3 className="text-lg font-bold mb-2">Free</h3>
                            <div className="text-2xl md:text-3xl font-extrabold mb-4">0 tk</div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> AI Resume Enhancement</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Copy to Clipboard</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> 3 Resumes/month</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-3 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="p-5 md:p-6 gradient-border rounded-2xl text-left relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3" /> POPULAR
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Pro</h3>
                            <div className="text-2xl md:text-3xl font-extrabold mb-4">200 tk</div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Everything in Free</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> PDF Export</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Unlimited Resumes</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-3 text-center bg-primary-500 dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 rounded-xl text-white font-medium transition-all">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="p-5 md:p-6 glass rounded-2xl text-left">
                            <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                            <div className="text-2xl md:text-3xl font-extrabold mb-4">Custom</div>
                            <ul className="space-y-2 text-sm text-text-light-secondary dark:text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Everything in Pro</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Team Management</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary-500 dark:text-accent-400" /> Priority Support</li>
                            </ul>
                            <button className="block w-full py-3 text-center bg-light-100 dark:bg-dark-700 hover:bg-light-200 dark:hover:bg-dark-600 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 md:py-20 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-text-light-secondary dark:text-gray-400 mb-8">
                        Join thousands of professionals who've upgraded their careers with CVBanai.
                    </p>
                    <Link
                        to="/auth?mode=signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold text-lg transition-all glow-teal"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 md:py-8 px-6 md:px-8 border-t border-light-200 dark:border-dark-700/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <Logo className="h-6" textColor="text-text-light-primary dark:text-white" />
                    <p className="text-sm text-text-light-secondary dark:text-gray-500">
                        © 2026 CVBanai. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
