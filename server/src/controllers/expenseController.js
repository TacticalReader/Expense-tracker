import { supabaseAdmin } from '../config/supabaseAdmin.js'
import { sendSuccess, sendError } from '../utils/responseHelper.js'

// ── Valid categories — must exactly match the frontend list ───────
const VALID_CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Health',
    'Housing', 'Education', 'Entertainment', 'Other',
]

// ── Date format validator — expects 'YYYY-MM-DD' ──────────────────
const isValidDate = (str) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false
    const d = new Date(str + 'T00:00:00')
    return !isNaN(d.getTime())
}

// ════════════════════════════════════════════════════════════════
// GET /api/expenses
// Returns all expenses for the logged-in user, newest first.
// ════════════════════════════════════════════════════════════════
export const getAllExpenses = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('expenses')
            .select('*')
            .eq('user_id', req.user.id)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[getAllExpenses] Supabase error:', error.message)
            return sendError(res, 'Failed to fetch expenses.', 500)
        }

        // sendSuccess sends the array directly — frontend does
        // Array.isArray(data) check in useExpenses (Phase 6)
        return sendSuccess(res, data ?? [])
    } catch (err) {
        console.error('[getAllExpenses] Unexpected error:', err.message)
        return sendError(res, 'An unexpected error occurred.', 500)
    }
}

// ════════════════════════════════════════════════════════════════
// POST /api/expenses
// Creates a new expense for the logged-in user.
// Returns the created expense object (with id and created_at).
// ════════════════════════════════════════════════════════════════
export const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date, note } = req.body

        // ── Server-side validation ──────────────────────────────
        // Client validates too (Phase 7 ExpenseForm), but we always
        // validate on the server as well — never trust the client.
        if (!title || typeof title !== 'string' || !title.trim()) {
            return sendError(res, 'Title is required.', 400)
        }
        if (title.trim().length > 100) {
            return sendError(res, 'Title must be 100 characters or fewer.', 400)
        }
        if (amount === undefined || amount === null || isNaN(Number(amount))) {
            return sendError(res, 'Amount must be a valid number.', 400)
        }
        if (Number(amount) <= 0) {
            return sendError(res, 'Amount must be greater than zero.', 400)
        }
        if (!category || !VALID_CATEGORIES.includes(category)) {
            return sendError(
                res,
                `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`,
                400
            )
        }
        if (!date || !isValidDate(date)) {
            return sendError(
                res,
                'Date is required and must be in YYYY-MM-DD format.',
                400
            )
        }

        // ── Insert into Supabase ────────────────────────────────
        const { data, error } = await supabaseAdmin
            .from('expenses')
            .insert({
                user_id: req.user.id,
                title: title.trim(),
                amount: Number(amount),
                category,
                date,
                note: note ? String(note).trim() : '',
            })
            .select()   // return the inserted row
            .single()   // we inserted one row, expect one back

        if (error) {
            console.error('[createExpense] Supabase error:', error.message)
            return sendError(res, 'Failed to create expense.', 500)
        }

        // 201 Created with the full expense object
        return sendSuccess(res, data, 201)
    } catch (err) {
        console.error('[createExpense] Unexpected error:', err.message)
        return sendError(res, 'An unexpected error occurred.', 500)
    }
}

// ════════════════════════════════════════════════════════════════
// DELETE /api/expenses/:id
// Deletes an expense by ID.
// Verifies the expense belongs to req.user.id before deleting —
// users can NEVER delete another user's expenses.
// ════════════════════════════════════════════════════════════════
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return sendError(res, 'Expense ID is required.', 400)
        }

        // Delete only if BOTH id AND user_id match.
        // If user tries to delete someone else's expense,
        // the .eq('user_id') condition won't match and
        // count will be 0 → we return 404 (not 403) to avoid
        // leaking whether the expense exists at all.
        const { error, count } = await supabaseAdmin
            .from('expenses')
            .delete({ count: 'exact' })  // ask Supabase to return row count
            .eq('id', id)
            .eq('user_id', req.user.id)

        if (error) {
            console.error('[deleteExpense] Supabase error:', error.message)
            return sendError(res, 'Failed to delete expense.', 500)
        }

        if (count === 0) {
            // Either the ID doesn't exist or it belongs to another user
            return sendError(res, 'Expense not found.', 404)
        }

        return sendSuccess(res, { message: 'Expense deleted successfully.' })
    } catch (err) {
        console.error('[deleteExpense] Unexpected error:', err.message)
        return sendError(res, 'An unexpected error occurred.', 500)
    }
}