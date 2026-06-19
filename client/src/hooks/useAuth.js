import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import { supabase } from '../config/supabaseClient.js'

// ── useAuth hook ──────────────────────────────────────────────────
// Must be called inside a component that is a descendant of
// <AuthProvider>. Throws a clear error if used outside of it.
function useAuth() {
    const context = useContext(AuthContext)

    // Guard: if context is null, the hook was used outside AuthProvider
    if (context === null) {
        throw new Error(
            '[useAuth] useAuth must be used inside an <AuthProvider>.\n' +
            'Make sure your component is a descendant of <AuthProvider> in App.jsx.'
        )
    }

    // ── Local state for auth actions ────────────────────────────────
    // authLoading: true while login/signup/logout request is in flight
    // authError:   the latest error message string, or null
    const [authLoading, setAuthLoading] = useState(false)
    const [authError, setAuthError] = useState(null)

    // ── login ────────────────────────────────────────────────────────
    // Signs in an existing user with email and password.
    //
    // @param {string} email
    // @param {string} password
    // @returns {Promise<{ success: boolean, error: string | null }>}
    //
    // On success: AuthContext's onAuthStateChange fires automatically
    //             and updates user + session — no manual state update needed.
    // On failure: returns the error message to show in the form.
    const login = async (email, password) => {
        setAuthLoading(true)
        setAuthError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            })

            if (error) {
                // Map Supabase's raw error messages to friendlier ones
                const friendlyMessage = mapAuthError(error.message)
                setAuthError(friendlyMessage)
                return { success: false, error: friendlyMessage }
            }

            // Success — onAuthStateChange in AuthContext handles the state update
            return { success: true, error: null }
        } catch (err) {
            const message = 'An unexpected error occurred. Please try again.'
            setAuthError(message)
            return { success: false, error: message }
        } finally {
            setAuthLoading(false)
        }
    }

    // ── signup ───────────────────────────────────────────────────────
    // Creates a new user account with email and password.
    // Supabase sends a confirmation email automatically.
    // The user must confirm their email before they can log in
    // (this is the default Supabase behaviour — can be changed in
    // Supabase Dashboard → Authentication → Email settings).
    //
    // @param {string} email
    // @param {string} password
    // @returns {Promise<{ success: boolean, error: string | null }>}
    const signup = async (email, password) => {
        setAuthLoading(true)
        setAuthError(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
            })

            if (error) {
                const friendlyMessage = mapAuthError(error.message)
                setAuthError(friendlyMessage)
                return { success: false, error: friendlyMessage }
            }

            // Supabase returns a user even before email confirmation.
            // If identities array is empty, the email is already registered.
            if (data?.user && data.user.identities?.length === 0) {
                const message = 'An account with this email already exists.'
                setAuthError(message)
                return { success: false, error: message }
            }

            // Success — user needs to check email for confirmation link
            return { success: true, error: null }
        } catch (err) {
            const message = 'An unexpected error occurred. Please try again.'
            setAuthError(message)
            return { success: false, error: message }
        } finally {
            setAuthLoading(false)
        }
    }

    // ── logout ───────────────────────────────────────────────────────
    // Signs out the current user.
    // onAuthStateChange fires SIGNED_OUT and clears user + session
    // in AuthContext automatically.
    const logout = async () => {
        setAuthLoading(true)
        setAuthError(null)

        try {
            await supabase.auth.signOut()
            // AuthContext listener handles clearing user and session state
        } catch (err) {
            console.error('[useAuth] logout error:', err)
        } finally {
            setAuthLoading(false)
        }
    }

    // ── clearAuthError ───────────────────────────────────────────────
    // Call this when the user starts typing again after an error,
    // so the error message disappears as they correct their input.
    const clearAuthError = () => {
        setAuthError(null)
    }

    // ── Return everything the component needs ────────────────────────
    return {
        // From AuthContext — global state
        user: context.user,       // Supabase user object or null
        session: context.session, // Supabase session object or null
        loading: context.loading, // true only during initial session check

        // Local action state
        authLoading, // true while login/signup/logout is in progress
        authError,   // latest error message string, or null

        // Auth action functions
        login,
        signup,
        logout,
        clearAuthError,
    }
}

// ── mapAuthError ──────────────────────────────────────────────────
// Converts Supabase's raw technical error messages into friendly
// user-facing strings. Keeps error handling in one place.
//
// @param {string} rawMessage - The error.message from Supabase
// @returns {string} A user-friendly error message
function mapAuthError(rawMessage) {
    if (!rawMessage) return 'Something went wrong. Please try again.'

    const msg = rawMessage.toLowerCase()

    if (msg.includes('invalid login credentials')) {
        return 'Incorrect email or password. Please try again.'
    }
    if (msg.includes('email not confirmed')) {
        return 'Please confirm your email address before logging in. Check your inbox.'
    }
    if (msg.includes('user already registered')) {
        return 'An account with this email already exists. Try logging in instead.'
    }
    if (msg.includes('password should be at least')) {
        return 'Password must be at least 6 characters long.'
    }
    if (msg.includes('unable to validate email')) {
        return 'Please enter a valid email address.'
    }
    if (msg.includes('too many requests') || msg.includes('rate limit')) {
        return 'Too many attempts. Please wait a moment before trying again.'
    }
    if (msg.includes('network') || msg.includes('fetch')) {
        return 'Network error. Please check your internet connection.'
    }

    // Fallback: return the original message if no mapping found
    return rawMessage
}

export default useAuth