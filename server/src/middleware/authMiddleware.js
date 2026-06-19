import { supabaseAdmin } from '../config/supabaseAdmin.js'
import { sendError } from '../utils/responseHelper.js'

// ── authMiddleware ────────────────────────────────────────────────
// Applied via router.use(authMiddleware) in both route files.
// Must call next() to pass control to the next handler,
// or send a response to stop the request.
const authMiddleware = async (req, res, next) => {
    try {
        // ── Step 1: Read the Authorization header ─────────────────
        const authHeader = req.headers['authorization']

        if (!authHeader) {
            return sendError(res, 'Authorization header is required.', 401)
        }

        // ── Step 2: Extract the token ─────────────────────────────
        // Expected format: 'Bearer eyJhbGciOiJI...'
        const parts = authHeader.split(' ')

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return sendError(
                res,
                'Authorization header must be in the format: Bearer <token>',
                401
            )
        }

        const token = parts[1]

        if (!token) {
            return sendError(res, 'Token is missing from the Authorization header.', 401)
        }

        // ── Step 3: Verify the token with Supabase ────────────────
        // getUser() validates the JWT signature, checks expiry,
        // and returns the user associated with the token.
        // This is the officially recommended approach in Supabase docs.
        const { data, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !data?.user) {
            return sendError(
                res,
                error?.message || 'Invalid or expired token.',
                401
            )
        }

        // ── Step 4: Attach user info to req.user ──────────────────
        // Controllers read req.user.id to scope all DB queries
        // to the logged-in user only — never another user's data.
        req.user = {
            id: data.user.id,
            email: data.user.email,
        }

        // ── Step 5: Pass to the next handler (the controller) ─────
        next()
    } catch (err) {
        // Unexpected error (e.g. network issue calling Supabase)
        console.error('[authMiddleware] Unexpected error:', err.message)
        return sendError(res, 'Authentication failed. Please try again.', 500)
    }
}

export default authMiddleware