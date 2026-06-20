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
    UserPlus,
    LogIn,
    MailCheck,
    CheckCircle2,
    Info,
} from 'lucide-react'
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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
                        <div className="signup-success-icon-wrap">
                            <MailCheck size={40} className="signup-success-icon" />
                        </div>
                        <h2 className="signup-success-title">Check your email</h2>
                        <p className="signup-success-text">
                            We sent a confirmation link to{' '}
                            <strong>{confirmedEmail}</strong>
                        </p>
                        <p className="signup-success-hint">
                            Click the link in that email to activate your account,
                            then come back here to log in.
                        </p>
                        <div className="signup-success-steps">
                            <div className="signup-success-step">
                                <CheckCircle2 size={16} className="signup-step-icon" />
                                <span>Account created successfully</span>
                            </div>
                            <div className="signup-success-step">
                                <Mail size={16} className="signup-step-icon-pending" />
                                <span>Confirm your email address</span>
                            </div>
                            <div className="signup-success-step">
                                <LogIn size={16} className="signup-step-icon-pending" />
                                <span>Sign in and start tracking</span>
                            </div>
                        </div>
                        <Link
                            to="/login"
                            className="btn btn-primary btn-full signup-success-btn"
                        >
                            <LogIn size={18} />
                            Go to Login
                            <ArrowRight size={18} />
                        </Link>
                        <p className="signup-success-spam">
                            <Info size={13} />
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
                    <Link to="/" className="signup-brand">
                        <Wallet size={22} className="signup-brand-icon" />
                        ExpenseTracker
                    </Link>
                    <h1 className="signup-title">Create your account</h1>
                    <p className="signup-subtitle">
                        <ShieldCheck size={14} className="signup-subtitle-icon" />
                        Free forever. No credit card required.
                    </p>
                </div>

                {/* ── Signup form ── */}
                <form className="signup-form" onSubmit={handleSubmit} noValidate>

                    {/* Email field */}
                    <div className="form-group">
                        <label htmlFor="signup-email">
                            <Mail size={14} className="signup-label-icon" />
                            Email address
                        </label>
                        <div className="signup-input-wrapper">
                            <Mail size={16} className="signup-input-icon" />
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearErrors() }}
                                disabled={authLoading}
                                autoComplete="email"
                                autoFocus
                                className="signup-input-with-icon"
                            />
                        </div>
                    </div>

                    {/* Password field */}
                    <div className="form-group">
                        <label htmlFor="signup-password">
                            <Lock size={14} className="signup-label-icon" />
                            Password
                        </label>
                        <div className="signup-input-wrapper">
                            <Lock size={16} className="signup-input-icon" />
                            <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); clearErrors() }}
                                disabled={authLoading}
                                autoComplete="new-password"
                                className="signup-input-with-icon signup-input-with-toggle"
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm password field */}
                    <div className="form-group">
                        <label htmlFor="signup-confirm">
                            <Lock size={14} className="signup-label-icon" />
                            Confirm password
                        </label>
                        <div className="signup-input-wrapper">
                            <Lock size={16} className="signup-input-icon" />
                            <input
                                id="signup-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); clearErrors() }}
                                disabled={authLoading}
                                autoComplete="new-password"
                                className="signup-input-with-icon signup-input-with-toggle"
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {displayError && (
                        <div className="signup-error form-error" role="alert">
                            <AlertCircle size={15} className="signup-error-icon" />
                            {displayError}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        id="signup-submit-btn"
                        className="btn btn-primary btn-full btn-lg signup-submit"
                        disabled={authLoading}
                    >
                        {authLoading ? (
                            <>
                                <Loader2 size={18} className="signup-spinner" />
                                Creating account…
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                Create account
                                <ArrowRight size={18} className="signup-submit-arrow" />
                            </>
                        )}
                    </button>

                    {/* Terms note */}
                    <p className="signup-terms">
                        <ShieldCheck size={13} className="signup-terms-icon" />
                        By signing up you agree to keep your password safe
                        and not share your account with others.
                    </p>

                </form>

                {/* ── Card footer ── */}
                <div className="signup-footer">
                    <span className="signup-footer-text">Already have an account?</span>
                    <Link to="/login" className="signup-footer-link">
                        <LogIn size={14} />
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default SignupPage