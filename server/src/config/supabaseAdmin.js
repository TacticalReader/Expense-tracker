import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// ── Guard: fail loudly if env vars are missing ────────────────────
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
        '[supabaseAdmin] Missing environment variables.\n' +
        'Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY ' +
        'are set in your server/.env file.'
    )
}

// ── Create the admin Supabase client ──────────────────────────────
// autoRefreshToken: false — the server is stateless, no token refresh needed
// persistSession:   false — no session stored on the server
// The service role key gives full database access bypassing RLS.
export const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)