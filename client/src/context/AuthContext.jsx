import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabaseClient.js'

// ── Create the context ────────────────────────────────────────────
// Default value is null — components must be inside <AuthProvider>
// to access the context. If they are not, useAuth will throw a
// helpful error (see useAuth.js).
export const AuthContext = createContext(null)

// ── AuthProvider component ────────────────────────────────────────
// Wrap the entire app with this component (already done in App.jsx).
// It makes { user, session, loading } available to every component
// in the tree via useAuth().
export function AuthProvider({ children }) {
    // The Supabase user object — null when not logged in
    // Shape: { id, email, created_at, user_metadata, app_metadata, ... }
    const [user, setUser] = useState(null)

    // The full Supabase session — null when not logged in
    // Shape: { access_token, refresh_token, expires_at, user, ... }
    // The access_token is the JWT that apiService.js sends to the backend
    const [session, setSession] = useState(null)

    // True while we are checking for an existing session on first load.
    // Keeps the app from briefly showing the wrong page (e.g. flashing
    // the login page for a user who IS already logged in).
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // ── Step 1: Get the current session on first mount ─────────────
        // This reads from localStorage synchronously via Supabase's SDK.
        // If a valid session exists, user and session are set immediately.
        // This resolves the brief window where onAuthStateChange hasn't
        // fired yet and everything would appear as "logged out".
        const initializeSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('[AuthContext] getSession error:', error.message)
                }

                // data.session is null if no session exists, or the session object
                setSession(data?.session ?? null)
                setUser(data?.session?.user ?? null)
            } catch (err) {
                console.error('[AuthContext] Unexpected error in getSession:', err)
            } finally {
                // Always set loading to false after the initial check,
                // whether we found a session or not.
                setLoading(false)
            }
        }

        initializeSession()

        // ── Step 2: Listen for all future auth state changes ──────────
        // This fires on: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED,
        //                USER_UPDATED, PASSWORD_RECOVERY
        // We update user and session in state every time it fires.
        const { data: listenerData } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession ?? null)
                setUser(newSession?.user ?? null)
                // Note: we do NOT set loading here — loading is only for
                // the initial mount check (Step 1 above).
            }
        )

        // ── Cleanup: unsubscribe when AuthProvider unmounts ────────────
        // Prevents memory leaks. The subscription object is inside
        // listenerData.subscription per the Supabase v2 API.
        return () => {
            listenerData?.subscription?.unsubscribe()
        }
    }, []) // Empty dependency array — runs once on mount only

    // ── Context value ─────────────────────────────────────────────
    // This object is what useAuth() returns to every consumer.
    const contextValue = {
        user,     // Supabase user object or null
        session,  // Supabase session object or null
        loading,  // true only during initial session check on first load
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}