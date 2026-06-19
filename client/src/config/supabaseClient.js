import { createClient } from '@supabase/supabase-js'

// ── Read Supabase credentials from Vite environment variables ──
// These are set in client/.env (created in Phase 1)
// VITE_ prefix is required for Vite to expose them to the browser
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// ── Guard: fail loudly in development if env vars are missing ──
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
        '[supabaseClient] Missing environment variables.\n' +
        'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY ' +
        'are set in your client/.env file.'
    )
}

// ── Create and export the Supabase client ──
// autoRefreshToken  → keeps the session alive automatically before it expires
// persistSession    → saves the session to localStorage so the user
//                     stays logged in after a page refresh
// detectSessionInUrl → handles the token that Supabase puts in the URL
//                      after email confirmation or OAuth redirects
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})