import axios from 'axios'
import { supabase } from '../config/supabaseClient.js'

// ── Backend URL — change this to your Render URL when you deploy ──
// Development : 'http://localhost:5000'
// Production  : 'https://your-app-name.onrender.com'
const BASE_URL = 'http://localhost:5000'

// ── Create a shared axios instance ────────────────────────────────
// All API functions below use this instance, not plain axios.
// baseURL is set so every call only needs to specify the path.
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ── Request Interceptor ───────────────────────────────────────────
// Runs automatically before every request made with apiClient.
// Gets the current Supabase session and injects the JWT access token
// as an Authorization header. The Express backend (Phase 11) reads
// this header to verify the user and identify who made the request.
apiClient.interceptors.request.use(
    async (config) => {
        // getSession() reads the token from localStorage (no network call)
        const { data } = await supabase.auth.getSession()
        const token = data?.session?.access_token

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ── Response Interceptor ──────────────────────────────────────────
// Normalizes all error messages coming from the backend into a
// consistent shape before they reach the hook layer.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend sent a JSON error body, use its message.
        // Otherwise fall back to the axios error message.
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Something went wrong. Please try again.'

        // Re-throw as a plain Error so hooks can do: catch (err) { err.message }
        return Promise.reject(new Error(message))
    }
)

// ═══════════════════════════════════════════════════════════════════
// EXPENSE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/expenses
 * Fetches all expenses for the currently logged-in user.
 *
 * @returns {Promise<Array>} Array of expense objects
 * Each expense object shape returned from backend:
 * {
 *   id:         string   (UUID)
 *   user_id:    string   (UUID — Supabase user id)
 *   title:      string
 *   amount:     number
 *   category:   string   ('Food' | 'Transport' | 'Shopping' | 'Health' |
 *                          'Housing' | 'Education' | 'Entertainment' | 'Other')
 *   date:       string   (ISO date — 'YYYY-MM-DD')
 *   note:       string   (can be empty string)
 *   created_at: string   (ISO datetime)
 * }
 */
export const getExpenses = async () => {
    try {
        const response = await apiClient.get('/api/expenses')
        return response.data
    } catch (error) {
        throw error
    }
}

/**
 * POST /api/expenses
 * Adds a new expense for the currently logged-in user.
 *
 * @param {Object} expenseData
 * @param {string} expenseData.title          - Name/description of the expense
 * @param {number} expenseData.amount         - Amount spent (positive number)
 * @param {string} expenseData.category       - One of the 8 category strings above
 * @param {string} expenseData.date           - Date in 'YYYY-MM-DD' format
 * @param {string} [expenseData.note]         - Optional extra note (can be empty)
 *
 * @returns {Promise<Object>} The newly created expense object (same shape as above)
 */
export const addExpense = async (expenseData) => {
    try {
        const response = await apiClient.post('/api/expenses', expenseData)
        return response.data
    } catch (error) {
        throw error
    }
}

/**
 * DELETE /api/expenses/:id
 * Deletes a single expense by its ID.
 * The backend verifies the expense belongs to the logged-in user
 * before deleting — users cannot delete other users' expenses.
 *
 * @param {string} id - The UUID of the expense to delete
 * @returns {Promise<Object>} Success confirmation object { message: string }
 */
export const deleteExpense = async (id) => {
    try {
        const response = await apiClient.delete(`/api/expenses/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// ═══════════════════════════════════════════════════════════════════
// BUDGET ENDPOINTS
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/budgets
 * Fetches all budget limits set by the currently logged-in user.
 *
 * @returns {Promise<Array>} Array of budget objects
 * Each budget object shape returned from backend:
 * {
 *   id:            string   (UUID)
 *   user_id:       string   (UUID)
 *   category:      string   (same 8 categories as expenses)
 *   monthly_limit: number   (the budget cap for this category)
 *   month:         string   ('YYYY-MM' format — e.g. '2026-06')
 *   created_at:    string   (ISO datetime)
 * }
 */
export const getBudgets = async () => {
    try {
        const response = await apiClient.get('/api/budgets')
        return response.data
    } catch (error) {
        throw error
    }
}

/**
 * POST /api/budgets
 * Creates or updates a budget limit for a category in a given month.
 * If a budget already exists for this category + month combination,
 * the backend will update it (upsert behaviour).
 *
 * @param {Object} budgetData
 * @param {string} budgetData.category       - One of the 8 category strings
 * @param {number} budgetData.monthly_limit  - The spending cap (positive number)
 * @param {string} budgetData.month          - Month in 'YYYY-MM' format
 *
 * @returns {Promise<Object>} The created or updated budget object (same shape as above)
 */
export const setBudget = async (budgetData) => {
    try {
        const response = await apiClient.post('/api/budgets', budgetData)
        return response.data
    } catch (error) {
        throw error
    }
}