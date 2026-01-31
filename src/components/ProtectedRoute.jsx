import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useAuth()
    const location = useLocation()

    if (!isLoaded) {
        return (
            <div className="min-h-screen animated-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-dark-700"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                    </div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isSignedIn) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}
