import { createContext, useContext } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()

    const value = {
        user,
        loading: !isLoaded,
        signOut: async () => {
            await signOut()
            return { error: null }
        },
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
