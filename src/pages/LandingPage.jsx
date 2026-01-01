import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, Shield, ArrowRight, Check, Star } from 'lucide-react'
import Logo from '../components/Logo'

export default function LandingPage() {
    return (
        <div className="min-h-screen animated-bg">
            {/* Navigation */}
            <nav className="py-6 px-8 border-b border-dark-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="h-10" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-gray-400 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/auth?mode=signup"
                            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-medium transition-all"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-8">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-gray-300">AI-Powered Resume Enhancement</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up">
                        Build Resumes That
                        <span className="block gradient-text">Get You Hired</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Transform your career story into a powerful, ATS-optimized resume with our AI refinement engine. Stand out from the crowd.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/auth?mode=signup"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-semibold text-lg transition-all glow-teal"
                        >
                            Start Building Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/auth"
                            className="flex items-center gap-2 px-8 py-4 glass hover:bg-dark-700 rounded-xl text-white font-semibold text-lg transition-all"
                        >
                            Login to Dashboard
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent-400" />
                            <span>ATS-optimized templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent-400" />
                            <span>Powered by Gemini AI</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-8 border-t border-dark-700/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything You Need to Land Your Dream Job
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Our AI-powered platform transforms ordinary resumes into interview-winning documents.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 glass rounded-2xl hover:glow-teal transition-all duration-500">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-6">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Enhancement</h3>
                            <p className="text-gray-400">
                                Our Gemini-powered AI transforms weak language into powerful, action-oriented statements that impress recruiters.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 glass rounded-2xl hover:glow-cyan transition-all duration-500">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">ATS Optimized</h3>
                            <p className="text-gray-400">
                                Beat the applicant tracking systems with properly formatted resumes that get past the bots and into human hands.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 glass rounded-2xl hover:glow-teal transition-all duration-500">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                            <p className="text-gray-400">
                                Your data is encrypted and secure. We never share your information with third parties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-20 px-8 border-t border-dark-700/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 mb-12">
                        Start for free, upgrade when you need more features.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Free Tier */}
                        <div className="p-6 glass rounded-2xl text-left">
                            <h3 className="text-lg font-bold mb-2">Free</h3>
                            <div className="text-3xl font-extrabold mb-4">0 tk</div>
                            <ul className="space-y-2 text-sm text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> AI Resume Enhancement</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Copy to Clipboard</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> 3 Resumes/month</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-3 text-center bg-dark-700 hover:bg-dark-600 rounded-xl font-medium transition-all">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="p-6 gradient-border rounded-2xl text-left relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3" /> POPULAR
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Pro</h3>
                            <div className="text-3xl font-extrabold mb-4">200 tk</div>
                            <ul className="space-y-2 text-sm text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Everything in Free</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> PDF Export</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Unlimited Resumes</li>
                            </ul>
                            <Link to="/auth?mode=signup" className="block w-full py-3 text-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-medium transition-all">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Enterprise */}
                        <div className="p-6 glass rounded-2xl text-left">
                            <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                            <div className="text-3xl font-extrabold mb-4">Custom</div>
                            <ul className="space-y-2 text-sm text-gray-400 mb-6">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Everything in Pro</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Team Management</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-accent-400" /> Priority Support</li>
                            </ul>
                            <button className="block w-full py-3 text-center bg-dark-700 hover:bg-dark-600 rounded-xl font-medium transition-all">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-8 border-t border-dark-700/50">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Join thousands of professionals who've upgraded their careers with CVBanai.
                    </p>
                    <Link
                        to="/auth?mode=signup"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-semibold text-lg transition-all glow-teal"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-8 border-t border-dark-700/50">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Logo className="h-6" />
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2026 CVBanai. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
