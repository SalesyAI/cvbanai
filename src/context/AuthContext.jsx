import { createContext, useContext } from 'react'
import { authClient, useSession } from '../lib/auth-client'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Helper to extract error message from BetterAuth error objects
const extractErrorMessage = (err) => {
    if (!err) return 'An error occurred'
    if (typeof err === 'string') return err
    if (err.message) return err.message
    if (err.code) return err.code
    if (err.statusText) return err.statusText
    return JSON.stringify(err)
}

export const AuthProvider = ({ children }) => {
    // Use BetterAuth's useSession hook
    const { data: session, isPending: loading, error } = useSession()

    const user = session?.user ?? null

    const value = {
        user,
        session,
        loading,
        error,

        // Sign up with email and password
        signUp: async (email, password, fullName) => {
            try {
                const result = await authClient.signUp.email({
                    email,
                    password,
                    name: fullName,
                    callbackURL: '/dashboard'
                })

                if (result.error) {
                    return { data: null, error: { message: extractErrorMessage(result.error) } }
                }

                return { data: result.data, error: null }
            } catch (err) {
                return { data: null, error: { message: extractErrorMessage(err) } }
            }
        },

        // Sign in with email and password
        signIn: async (email, password) => {
            try {
                const result = await authClient.signIn.email({
                    email,
                    password,
                    callbackURL: '/dashboard'
                })

                if (result.error) {
                    return { data: null, error: { message: extractErrorMessage(result.error) } }
                }

                return { data: result.data, error: null }
            } catch (err) {
                return { data: null, error: { message: extractErrorMessage(err) } }
            }
        },

        // Sign out
        signOut: async () => {
            try {
                await authClient.signOut()
                return { error: null }
            } catch (err) {
                return { error: { message: extractErrorMessage(err) } }
            }
        },

        // Sign in with Google OAuth
        signInWithGoogle: async () => {
            try {
                const result = await authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/dashboard'
                })

                if (result.error) {
                    return { data: null, error: { message: extractErrorMessage(result.error) } }
                }

                return { data: result.data, error: null }
            } catch (err) {
                return { data: null, error: { message: extractErrorMessage(err) } }
            }
        },

        // Resend verification email
        resendVerificationEmail: async (email) => {
            try {
                const result = await authClient.sendVerificationEmail({
                    email,
                    callbackURL: '/dashboard'
                })

                if (result.error) {
                    return { error: { message: extractErrorMessage(result.error) } }
                }

                return { error: null }
            } catch (err) {
                return { error: { message: extractErrorMessage(err) } }
            }
        }
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
