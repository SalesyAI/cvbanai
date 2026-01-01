import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function AuthPage() {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { signIn, signUp, signInWithGoogle, user } = useAuth()

    const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    // Update mode based on URL
    useEffect(() => {
        setIsSignUp(searchParams.get('mode') === 'signup')
    }, [searchParams])

    // User-friendly error messages
    const getErrorMessage = (error) => {
        const errorMap = {
            'Invalid login credentials': 'Incorrect email or password. Please try again.',
            'User already registered': 'This email is already registered. Try logging in instead.',
            'Email not confirmed': 'Please check your email inbox and confirm your account.',
            'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
            'Invalid email': 'Please enter a valid email address.',
            'Signup requires a valid password': 'Please enter a password.',
        }
        return errorMap[error] || error || 'Something went wrong. Please try again.'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password, fullName)
                if (error) throw error
                setSuccess('Account created! Please check your email to confirm.')
            } else {
                const { error } = await signIn(email, password)
                if (error) throw error
                navigate('/dashboard')
            }
        } catch (err) {
            setError(getErrorMessage(err.message))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        setError('')
        try {
            const { error } = await signInWithGoogle()
            if (error) throw error
        } catch (err) {
            setError(getErrorMessage(err.message))
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen animated-bg flex flex-col">
            {/* Header */}
            <header className="py-4 px-6 flex items-center justify-between">
                <Link to="/">
                    <Logo className="h-9" textColor="text-text-light-primary dark:text-white" />
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Auth Card */}
                    <div className="glass rounded-2xl p-6 md:p-8">
                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                {isSignUp ? 'Create your account' : 'Welcome back'}
                            </h1>
                            <p className="text-text-light-secondary dark:text-gray-400">
                                {isSignUp
                                    ? 'Start building professional resumes today'
                                    : 'Log in to continue building your resume'
                                }
                            </p>
                        </div>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-dark-800 hover:bg-light-100 dark:hover:bg-dark-700 border border-light-200 dark:border-dark-600 rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-text-light-primary dark:text-white">
                                Continue with Google
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-light-200 dark:bg-dark-700"></div>
                            <span className="text-sm text-text-light-secondary dark:text-gray-500">or</span>
                            <div className="flex-1 h-px bg-light-200 dark:bg-dark-700"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name field (signup only) */}
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-gray-500" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-600 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-600 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light-secondary dark:text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-3 bg-white dark:bg-dark-800 border border-light-200 dark:border-dark-600 rounded-xl text-text-light-primary dark:text-white placeholder:text-text-light-secondary/50 dark:placeholder:text-gray-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-gray-500 hover:text-primary-500"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl text-green-600 dark:text-green-400">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">{success}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-500 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Toggle Mode */}
                        <p className="text-center mt-6 text-text-light-secondary dark:text-gray-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <Link
                                to={isSignUp ? '/auth' : '/auth?mode=signup'}
                                className="text-primary-500 dark:text-primary-400 hover:underline font-medium"
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
