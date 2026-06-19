import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, ArrowLeft } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import './NotFoundPage.css'

function NotFoundPage() {
    const { user, loading } = useAuth()

    // While session check runs, render nothing to avoid flicker
    if (loading) return null

    return (
        <div className="not-found-page">
            <div className="not-found-card">

                {/* ── 404 number ── */}
                <div className="not-found-code" aria-hidden="true">
                    404
                </div>

                {/* ── Message ── */}
                <h1 className="not-found-title">Page not found</h1>
                <p className="not-found-text">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* ── Actions ── */}
                <div className="not-found-actions">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="btn btn-primary btn-lg not-found-btn"
                            >
                                <LayoutDashboard size={18} aria-hidden="true" />
                                Go to Dashboard
                            </Link>
                            <Link
                                to="/expenses"
                                className="btn btn-secondary not-found-btn"
                            >
                                <ArrowLeft size={16} aria-hidden="true" />
                                View Expenses
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/"
                                className="btn btn-primary btn-lg not-found-btn"
                            >
                                <Home size={18} aria-hidden="true" />
                                Go to Home
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-secondary not-found-btn"
                            >
                                <ArrowLeft size={16} aria-hidden="true" />
                                Log in
                            </Link>
                        </>
                    )}
                </div>

                {/* ── Brand ── */}
                <Link to="/" className="not-found-brand">
                    💰 ExpenseTracker
                </Link>

            </div>
        </div>
    )
}

export default NotFoundPage