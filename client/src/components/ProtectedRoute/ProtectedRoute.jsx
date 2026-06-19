import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx'
import './ProtectedRoute.css'

// Props:
//   children — the protected page component to render if authenticated
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    // Session check is still running — show spinner instead of flashing /login
    if (loading) {
        return (
            <div className="protected-route-loading">
                <LoadingSpinner size="lg" fullPage message="Loading your account..." />
            </div>
        )
    }

    // No user after loading completed — redirect to login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // User is authenticated — render the requested page
    return children
}

export default ProtectedRoute