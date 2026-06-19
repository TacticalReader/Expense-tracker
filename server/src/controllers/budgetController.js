import { supabaseAdmin } from '../config/supabaseAdmin.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// ── Valid categories — must exactly match frontend ────────────────
const VALID_CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Health',
    'Housing', 'Education', 'Entertainment', 'Other',
]

// ── Month format validator — expects 'YYYY-MM' ────────────────────
const isValidMonth = (str) => /^\d{4}-\d{2}$/.test(str)

// ════════════════════════════════════════════════════════════════
// GET /api/budgets
// Returns all budgets for the logged-in user.
// Ordered newest month first, then alphabetically by category.
// ════════════════════════════════════════════════════════════════
export const getBudgets = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('budgets')
            .select('*')
            .eq('user_id', req.user.id)
            .order('month', { ascending: false })
            .order('category', { ascending: true })

        if (error) {
            console.error('[getBudgets] Supabase error:', error.message)
            return sendError(res, 'Failed to fetch budgets.', 500)
        }

        return sendSuccess(res, data ?? [])
    } catch (err) {
        console.error('[getBudgets] Unexpected error:', err.message)
        return sendError(res, 'An unexpected error occurred.', 500)
    }
}

// ════════════════════════════════════════════════════════════════
// POST /api/budgets
// Creates or updates (upserts) a budget for a category + month.
// The UNIQUE(user_id, category, month) constraint in the DB
// means calling this twice for the same combo just updates it.
// Returns the created or updated budget object.
// ════════════════════════════════════════════════════════════════
export const upsertBudget = async (req, res) => {
    try {
        const { category, monthly_limit, month } = req.body

        // ── Server-side validation ──────────────────────────────
        if (!category || !VALID_CATEGORIES.includes(category)) {
            return sendError(
                res,
                `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`,
                400
            )
        }

        if (
            monthly_limit === undefined ||
            monthly_limit === null ||
            isNaN(Number(monthly_limit))
        ) {
            return sendError(res, 'Monthly limit must be a valid number.', 400)
        }

        if (Number(monthly_limit) <= 0) {
            return sendError(res, 'Monthly limit must be greater than zero.', 400)
        }

        if (!month || !isValidMonth(month)) {
            return sendError(
                res,
                'Month is required and must be in YYYY-MM format (e.g. 2026-06).',
                400
            )
        }

        // ── Upsert into Supabase ────────────────────────────────
        // onConflict tells Supabase which columns define a conflict.
        // When (user_id, category, month) already exists → UPDATE.
        // When it doesn't exist → INSERT.
        // .select().single() returns the final row in both cases.
        const { data, error } = await supabaseAdmin
            .from('budgets')
            .upsert(
                {
                    user_id: req.user.id,
                    category,
                    monthly_limit: Number(monthly_limit),
                    month,
                },
                { onConflict: 'user_id,category,month' }
            )
            .select()
            .single()

        if (error) {
            console.error('[upsertBudget] Supabase error:', error.message)
            return sendError(res, 'Failed to save budget.', 500)
        }

        // 201 Created/Updated with the full budget object
        return sendSuccess(res, data, 201)
    } catch (err) {
        console.error('[upsertBudget] Unexpected error:', err.message)
        return sendError(res, 'An unexpected error occurred.', 500)
    }
}