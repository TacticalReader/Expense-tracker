import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import {
    Wallet,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    ArrowRight,
    Loader2,
    ShieldCheck,
    LogIn,
    UserPlus,
} from 'lucide-react'
import './LoginPage.css'

function LoginPage() {
    const { user, loading, login, authLoading, authError, clearAuthError } = useAuth()
    const navigate = useNavigate()

    // Local form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState('')

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, loading, navigate])

    // Clear errors when user starts typing
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        if (formError) setFormError('')
        if (authError) clearAuthError()
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        if (formError) setFormError('')
        if (authError) clearAuthError()
    }

    // ── Client-side validation ────────────────────────────────────
    const validate = () => {
        if (!email.trim()) {
            setFormError('Email address is required.')
            return false
        }
        if (!email.includes('@')) {
            setFormError('Please enter a valid email address.')
            return false
        }
        if (!password) {
            setFormError('Password is required.')
            return false
        }
        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.')
            return false
        }
        return true
    }

    // ── Form submit handler ───────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!validate()) return

        const result = await login(email, password)

        if (result.success) {
            navigate('/dashboard', { replace: true })
        }
        // If not success, authError is already set in useAuth
        // and will display automatically via the authError variable
    }

    // Show nothing while the initial session check is running
    if (loading) return null

    // The error to display — prefer local formError over authError
    const displayError = formError || authError

    return (
        <div className="login-page">
            <div className="login-card card">

                {/* ── Card header ── */}
                <div className="login-header">
                    <Link to="/" className="login-brand">
                        <Wallet size={22} className="login-brand-icon" />
                        ExpenseTracker
                    </Link>
                    <h1 className="login-title">Welcome back</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                </div>

                {/* ── Login form ── */}
                <form className="login-form" onSubmit={handleSubmit} noValidate>

                    {/* Email field */}
                    <div className="form-group">
                        <label htmlFor="login-email">
                            <Mail size={14} className="login-label-icon" />
                            Email address
                        </label>
                        <div className="login-input-wrapper">
                            <Mail size={16} className="login-input-icon" />
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={authLoading}
                                autoComplete="email"
                                autoFocus
                                className="login-input-with-icon"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="form-group">
                        <label htmlFor="login-password">
                            <Lock size={14} className="login-label-icon" />
                            Password
                        </label>
                        <div className="login-input-wrapper">
                            <Lock size={16} className="login-input-icon" />
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={authLoading}
                                autoComplete="current-password"
                                className="login-input-with-icon login-input-with-toggle"
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {displayError && (
                        <div className="login-error form-error" role="alert">
                            <AlertCircle size={15} className="login-error-icon" />
                            {displayError}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        id="login-submit-btn"
                        className="btn btn-primary btn-full btn-lg login-submit"
                        disabled={authLoading}
                    >
                        {authLoading ? (
                            <>
                                <Loader2 size={18} className="login-spinner" />
                                Signing in…
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign in
                                <ArrowRight size={18} className="login-submit-arrow" />
                            </>
                        )}
                    </button>

                </form>

                {/* ── Security badge ── */}
                <div className="login-security-badge">
                    <ShieldCheck size={14} />
                    <span>Secured with Supabase Auth</span>
                </div>

                {/* ── Card footer ── */}
                <div className="login-footer">
                    <span className="login-footer-text">Don&apos;t have an account?</span>
                    <Link to="/signup" className="login-footer-link">
                        <UserPlus size={14} />
                        Create one free
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default LoginPage