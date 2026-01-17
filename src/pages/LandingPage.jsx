import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Sparkles, Zap, Shield, ArrowRight, Check, Star, Linkedin, Globe, MessageCircle, Briefcase, Award, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [atsScore, setAtsScore] = useState(0)

    useEffect(() => {
        setIsVisible(true)
        // Animate ATS Score count up
        let start = 0
        const end = 98
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setAtsScore(end)
                clearInterval(timer)
            } else {
                setAtsScore(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePos({ x, y })
    }

    return (
        <div
            className="min-h-screen mesh-gradient mesh-animate overflow-x-hidden selection:bg-teal-500/30 spotlight-group"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
        >
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

            {/* Premium Hero Section */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-32 px-6 md:px-8 relative z-10 overflow-hidden">
                {/* Background Orbs */}
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                    {/* Left Column: Text & CTA */}
                    <div className="text-center lg:text-left">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                            <span className="text-xs font-bold tracking-wide uppercase text-teal-600 dark:text-teal-400">New: LinkedIn AI Agent</span>
                        </div>

                        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            Own the <br />
                            <span className="text-gradient-aurora">Future of Work.</span>
                        </h1>

                        <p className={`text-lg md:text-2xl text-text-light-secondary dark:text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            The elite ecosystem for modern professionals. Build high-impact resumes, dominate LinkedIn, and launch your brand with agentic AI.
                        </p>

                        <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <Link
                                to="/auth?mode=signup"
                                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 active:scale-95"
                            >
                                Start Free <span className="opacity-70 font-normal text-sm ml-1">(No CC required)</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/pricing"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 glass-card hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl text-text-light-primary dark:text-white font-semibold text-lg transition-all hover:-translate-y-1 active:scale-95 backdrop-blur-md"
                            >
                                See Examples
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: 3D Visuals */}
                    <div className="relative hidden lg:block perspective-1000">
                        <motion.div
                            className="hero-card-stack relative w-full aspect-square max-w-md mx-auto flex items-center justify-center"
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                        >
                            {/* Card 1: Resume - Back (Bottom) */}
                            <motion.div
                                variants={{
                                    initial: { x: "-65%", y: "-60%", rotate: -12, scale: 0.9, opacity: 0 },
                                    animate: {
                                        x: "-65%", y: "-60%", rotate: -12, scale: 0.9, opacity: 0.8,
                                        transition: { duration: 0.8, delay: 0.6 }
                                    },
                                    hover: { x: "-85%", y: "-70%", rotate: -20, scale: 0.95, opacity: 0.9 }
                                }}
                                animate="animate"
                                className="absolute left-1/2 top-1/2 w-[85%] aspect-[3/4] glass-frosted rounded-2xl p-6 shadow-xl z-0 border border-white/40 origin-center"
                            >
                                <motion.div
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-full w-full"
                                >
                                    <div className="space-y-4 opacity-70">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 shimer"></div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-24 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                                <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-3 w-1/3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                                            <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                                            <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Card 2: LinkedIn - Middle */}
                            <motion.div
                                variants={{
                                    initial: { x: "-55%", y: "-55%", rotate: -6, scale: 0.95, opacity: 0 },
                                    animate: {
                                        x: "-55%", y: "-55%", rotate: -6, scale: 0.95, opacity: 1,
                                        transition: { duration: 0.8, delay: 0.8 }
                                    },
                                    hover: { x: "-65%", y: "-55%", rotate: -10, scale: 1, zIndex: 30 }
                                }}
                                className="absolute left-1/2 top-1/2 w-[85%] aspect-[3/4] glass-frosted rounded-2xl p-8 shadow-2xl z-10 text-slate-800 dark:text-white border border-white/40 overflow-hidden origin-center"
                            >
                                <motion.div
                                    animate={{ y: [-8, 8, -8] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="h-full w-full relative"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-white/50 border-4 border-white dark:border-white/10 flex items-center justify-center text-xl font-bold text-teal-700">JD</div>
                                            <div className="absolute -bottom-1 -right-1 bg-teal-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <div className="h-4 w-32 bg-slate-400/30 rounded mb-2"></div>
                                            <div className="h-3 w-48 bg-slate-400/20 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="h-2.5 w-full bg-slate-400/20 rounded"></div>
                                        <div className="h-2.5 w-full bg-slate-400/20 rounded"></div>
                                        <div className="h-2.5 w-3/4 bg-slate-400/20 rounded"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm">
                                            <TrendingUp className="w-4 h-4 text-teal-600" />
                                            <div className="text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-100">Profile views up 450%</div>
                                        </div>
                                        <div className="inline-flex items-center self-start px-4 py-2 rounded-full bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-500/20">
                                            <Sparkles className="w-3.5 h-3.5 mr-2" /> AI Optimized
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Card 3: Dashboard - Front */}
                            <motion.div
                                variants={{
                                    initial: { x: "-50%", y: "-50%", rotate: 0, scale: 1, opacity: 0 },
                                    animate: {
                                        x: "-50%", y: "-50%", rotate: 0, scale: 1, opacity: 1,
                                        transition: { duration: 0.8, delay: 1.0 }
                                    },
                                    hover: { scale: 1.05, zIndex: 40 }
                                }}
                                className="absolute left-1/2 top-1/2 w-[85%] aspect-[3/4] glass-frosted bg-white/40 dark:bg-slate-900/40 rounded-2xl p-8 shadow-[0_30px_60px_-15px_rgba(20,184,166,0.15)] z-20 border border-white/60 backdrop-blur-2xl origin-center"
                            >
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="h-full w-full relative"
                                >
                                    <div className="scan-line"></div>
                                    <div className="flex items-center justify-between mb-10">
                                        <Logo className="h-7" />
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-[10px] font-bold text-teal-700 dark:text-teal-300`}>
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30">
                                            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1 leading-none">{atsScore}%</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-teal-800/60 dark:text-teal-300/60">ATS Success</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/10">
                                            <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1 leading-none">AI</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-teal-800/60 dark:text-teal-300/60">Powered</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="h-3 w-24 bg-slate-300/50 rounded"></div>
                                            <div className="text-[10px] font-bold text-teal-600 animate-pulse">OPTIMIZING...</div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-teal-400 to-teal-600"
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-1 bg-slate-200/50 rounded-full"></div>
                                            ))}
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                        className="absolute -bottom-8 -left-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 dark:border-slate-600 z-30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                                                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800 dark:text-white">Dream Job Landed!</div>
                                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Software Engineer @ Meta</div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, -12, 0],
                                            rotate: [12, 0, 12]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute -top-6 -right-6 bg-gradient-to-br from-teal-400 to-teal-600 p-4 rounded-2xl shadow-xl shadow-teal-500/30 z-30 transform rotate-12"
                                    >
                                        <Zap className="w-6 h-6 text-white" />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Infinite Marquee - Trusted By */}
                <div className="mt-20 md:mt-24 relative max-w-7xl mx-auto">
                    <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by professionals at</p>

                    <div className="marquee-container overflow-hidden whitespace-nowrap py-4">
                        <div className="inline-block animate-scroll">
                            {/* Repeated twice for seamless loop */}
                            <div className="inline-flex items-center gap-12 md:gap-20 px-4">
                                {['Google', 'Microsoft', 'Amazon', 'Spotify', 'Shopify', 'Tesla', 'Adobe', 'Meta'].map((company, i) => (
                                    <span key={i} className="text-2xl md:text-3xl font-extrabold text-slate-300 dark:text-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-default">
                                        {company}
                                    </span>
                                ))}
                                {['Google', 'Microsoft', 'Amazon', 'Spotify', 'Shopify', 'Tesla', 'Adobe', 'Meta'].map((company, i) => (
                                    <span key={`dup-${i}`} className="text-2xl md:text-3xl font-extrabold text-slate-300 dark:text-slate-700/50 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-default">
                                        {company}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
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
