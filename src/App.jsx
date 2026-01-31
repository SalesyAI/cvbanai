import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
