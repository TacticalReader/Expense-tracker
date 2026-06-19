import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import './SignupPage.css'

function SignupPage() {
    const {
        user,
        loading,
        signup,
        authLoading,
        authError,
        clearAuthError,
    } = useAuth()
    const navigate = useNavigate()

    // Local form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')

    // After successful signup — show the confirmation message
    const [signupSuccess, setSignupSuccess] = useState(false)
    const [confirmedEmail, setConfirmedEmail] = useState('')

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, loading, navigate])

    // Clear errors when user starts typing in any field
    const clearErrors = () => {
        if (formError) setFormError('')
        if (authError) clearAuthError()
    }

    // ── Client-side validation ────────────────────────────────────
    const validate = () => {
        if (!email.trim()) {
            setFormError('Email address is required.')
            return false
        }
        if (!email.includes('@') || !email.includes('.')) {
            setFormError('Please enter a valid email address.')
            return false
        }
        if (!password) {
            setFormError('Password is required.')
            return false
        }
        if (password.length < 6) {
            setFormError('Password must be at least 6 characters long.')
            return false
        }
        if (!confirmPassword) {
            setFormError('Please confirm your password.')
            return false
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match. Please check and try again.')
            return false
        }
        return true
    }

    // ── Form submit handler ───────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!validate()) return

        const result = await signup(email, password)

        if (result.success) {
            // Do NOT navigate — user must confirm email first
            // Show the success state with the email they used
            setConfirmedEmail(email.trim().toLowerCase())
            setSignupSuccess(true)
        }
        // If not success, authError is set in useAuth and displays below
    }

    // Show nothing while session check is running
    if (loading) return null

    const displayError = formError || authError

    // ── Success state — shown after successful signup ── 
    if (signupSuccess) {
        return (
            <div className="signup-page">
                <div className="signup-card card">
                    <div className="signup-success">
                        <div className="signup-success-icon">✉️</div>
                        <h2 className="signup-success-title">Check your email</h2>
                        <p className="signup-success-text">
                            We sent a confirmation link to{' '}
                            <strong>{confirmedEmail}</strong>
                        </p>
                        <p className="signup-success-hint">
                            Click the link in that email to activate your account,
                            then come back here to log in.
                        </p>
                        <Link
                            to="/login"
                            className="btn btn-primary btn-full signup-success-btn"
                        >
                            Go to Login
                        </Link>
                        <p className="signup-success-spam">
                            Didn&apos;t receive it? Check your spam folder.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // ── Normal signup form ────────────────────────────────────────
    return (
        <div className="signup-page">
            <div className="signup-card card">

                {/* ── Card header ── */}
                <div className="signup-header">
                    <Link to="/" className="signup-brand">💰 ExpenseTracker</Link>
                    <h1 className="signup-title">Create your account</h1>
                    <p className="signup-subtitle">Free forever. No credit card required.</p>
                </div>

                {/* ── Signup form ── */}
                <form className="signup-form" onSubmit={handleSubmit} noValidate>

                    {/* Email field */}
                    <div className="form-group">
                        <label htmlFor="signup-email">Email address</label>
                        <input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearErrors() }}
                            disabled={authLoading}
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    {/* Password field */}
                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearErrors() }}
                            disabled={authLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm password field */}
                    <div className="form-group">
                        <label htmlFor="signup-confirm">Confirm password</label>
                        <input
                            id="signup-confirm"
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); clearErrors() }}
                            disabled={authLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Error message */}
                    {displayError && (
                        <div className="signup-error form-error" role="alert">
                            {displayError}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg signup-submit"
                        disabled={authLoading}
                    >
                        {authLoading ? 'Creating account...' : 'Create account'}
                    </button>

                    {/* Terms note */}
                    <p className="signup-terms">
                        By signing up you agree to keep your password safe
                        and not share your account with others.
                    </p>

                </form>

                {/* ── Card footer ── */}
                <div className="signup-footer">
                    <span className="signup-footer-text">Already have an account?</span>
                    <Link to="/login" className="signup-footer-link">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default SignupPage