import { SignIn, SignUp } from '@clerk/clerk-react'
import { useSearchParams, Link } from 'react-router-dom'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function AuthPage() {
    const [searchParams] = useSearchParams()
    const isSignUp = searchParams.get('mode') === 'signup'

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
                {isSignUp ? (
                    <SignUp
                        routing="path"
                        path="/auth"
                        signInUrl="/auth"
                        afterSignUpUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "max-w-md w-full",
                                card: "glass rounded-2xl",
                            },
                        }}
                    />
                ) : (
                    <SignIn
                        routing="path"
                        path="/auth"
                        signUpUrl="/auth?mode=signup"
                        afterSignInUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "max-w-md w-full",
                                card: "glass rounded-2xl",
                            },
                        }}
                    />
                )}
            </main>
        </div>
    )
}
