import { useContext, useEffect, useMemo, useCallback } from 'react'
import { ExpenseContext } from '../context/ExpenseContext.jsx'
import useAuth from './useAuth.js'
import {
    getExpenses,
    addExpense as addExpenseAPI,
    deleteExpense as deleteExpenseAPI,
    getBudgets,
    setBudget as setBudgetAPI,
} from '../services/apiService.js'

// ── useExpenses hook ──────────────────────────────────────────────
// Must be called inside a component that is a descendant of both
// <AuthProvider> and <ExpenseProvider>.
function useExpenses() {
    const context = useContext(ExpenseContext)

    // Guard: throw if used outside ExpenseProvider
    if (context === null) {
        throw new Error(
            '[useExpenses] Must be used inside an <ExpenseProvider>.\n' +
            'Make sure your component is a descendant of <ExpenseProvider> in App.jsx.'
        )
    }

    // Destructure everything from context
    const {
        expenses,
        setExpenses,
        budgets,
        setBudgets,
        expensesLoading,
        setExpensesLoading,
        budgetsLoading,
        setBudgetsLoading,
        expensesError,
        setExpensesError,
        budgetsError,
        setBudgetsError,
    } = context

    // Get the current logged-in user from AuthContext
    const { user } = useAuth()

    // ── Current month in 'YYYY-MM' format ───────────────────────
    // Used for filtering expenses and matching budget records.
    // e.g. '2026-06'
    const currentMonth = new Date().toISOString().slice(0, 7)

    // ════════════════════════════════════════════════════════════
    // FETCH FUNCTIONS
    // ════════════════════════════════════════════════════════════

    // ── fetchExpenses ────────────────────────────────────────────
    // Calls GET /api/expenses, updates state + localStorage.
    // Wrapped in useCallback so it is stable across renders and
    // safe to list in useEffect dependency arrays.
    const fetchExpenses = useCallback(async () => {
        setExpensesLoading(true)
        setExpensesError(null)

        try {
            const data = await getExpenses()
            // data is an array of expense objects from the backend.
            // setExpenses updates React state AND writes to localStorage
            // (because it comes from useLocalStorage in ExpenseContext).
            setExpenses(Array.isArray(data) ? data : [])
        } catch (err) {
            setExpensesError(
                err.message || 'Failed to load expenses. Please try again.'
            )
        } finally {
            setExpensesLoading(false)
        }
    }, [setExpenses, setExpensesLoading, setExpensesError])

    // ── fetchBudgets ─────────────────────────────────────────────
    const fetchBudgets = useCallback(async () => {
        setBudgetsLoading(true)
        setBudgetsError(null)

        try {
            const data = await getBudgets()
            setBudgets(Array.isArray(data) ? data : [])
        } catch (err) {
            setBudgetsError(
                err.message || 'Failed to load budgets. Please try again.'
            )
        } finally {
            setBudgetsLoading(false)
        }
    }, [setBudgets, setBudgetsLoading, setBudgetsError])

    // ════════════════════════════════════════════════════════════
    // AUTO-FETCH ON LOGIN / CLEAR ON LOGOUT
    // ════════════════════════════════════════════════════════════

    useEffect(() => {
        if (user) {
            // User just logged in (or page refreshed while logged in)
            // Fetch fresh data from backend — localStorage cache already
            // showed instantly, this just syncs to latest server data.
            fetchExpenses()
            fetchBudgets()
        } else {
            // User logged out — clear all data from state AND localStorage
            // Security: never leave another user's data in the browser
            setExpenses([])
            setBudgets([])
            setExpensesError(null)
            setBudgetsError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
    // NOTE: We intentionally omit fetchExpenses, fetchBudgets, setExpenses,
    // setBudgets from the dep array. They are stable (useCallback / useLocalStorage
    // setter), but listing them would cause an extra fetch on every render
    // in React StrictMode. The user dependency is all we need here.

    // ════════════════════════════════════════════════════════════
    // MUTATION FUNCTIONS
    // ════════════════════════════════════════════════════════════

    // ── addExpense ───────────────────────────────────────────────
    // POSTs a new expense to the backend.
    // On success: prepends the returned object (which has the real
    // UUID and created_at from the database) to the expenses array.
    //
    // @param {Object} expenseData
    //   { title, amount, category, date, note }  (see apiService.js for full shape)
    // @returns {{ success: boolean, error: string | null }}
    const addExpense = async (expenseData) => {
        try {
            const newExpense = await addExpenseAPI(expenseData)
            // Prepend so the newest expense appears at the top of lists
            setExpenses((prev) => [newExpense, ...prev])
            return { success: true, error: null }
        } catch (err) {
            return {
                success: false,
                error: err.message || 'Failed to add expense. Please try again.',
            }
        }
    }

    // ── deleteExpense ────────────────────────────────────────────
    // Deletes an expense by ID with optimistic UI:
    // 1. Remove from local state immediately (feels instant to user)
    // 2. Call the backend
    // 3. If backend fails: restore the removed item (rollback)
    //
    // @param {string} id — UUID of the expense to delete
    // @returns {{ success: boolean, error: string | null }}
    const deleteExpense = async (id) => {
        // Save the item before removing it (needed for rollback)
        const itemToDelete = expenses.find((e) => e.id === id)

        // Optimistic remove — updates state + localStorage immediately
        setExpenses((prev) => prev.filter((e) => e.id !== id))

        try {
            await deleteExpenseAPI(id)
            return { success: true, error: null }
        } catch (err) {
            // Rollback: restore the deleted item back to the list
            if (itemToDelete) {
                setExpenses((prev) => {
                    // Add it back in its original position by date (newest first)
                    const restored = [...prev, itemToDelete]
                    return restored.sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                    )
                })
            }
            return {
                success: false,
                error: err.message || 'Failed to delete expense. Please try again.',
            }
        }
    }

    // ── createBudget ─────────────────────────────────────────────
    // Creates OR updates a budget limit for a category + month.
    // The backend does an upsert, so calling this twice for the
    // same category + month just updates the existing record.
    // On success: upserts the returned budget in local budgets array.
    //
    // @param {Object} budgetData
    //   { category, monthly_limit, month }  (month = 'YYYY-MM')
    // @returns {{ success: boolean, error: string | null }}
    const createBudget = async (budgetData) => {
        try {
            const savedBudget = await setBudgetAPI(budgetData)

            setBudgets((prev) => {
                // Check if a budget for this category + month already exists
                const existingIndex = prev.findIndex(
                    (b) =>
                        b.category === savedBudget.category &&
                        b.month === savedBudget.month
                )

                if (existingIndex !== -1) {
                    // Update the existing entry
                    const updated = [...prev]
                    updated[existingIndex] = savedBudget
                    return updated
                }

                // No existing entry — append the new one
                return [...prev, savedBudget]
            })

            return { success: true, error: null }
        } catch (err) {
            return {
                success: false,
                error: err.message || 'Failed to save budget. Please try again.',
            }
        }
    }

    // ════════════════════════════════════════════════════════════
    // COMPUTED / DERIVED VALUES  (useMemo — recalculate only when
    // expenses or budgets arrays change, not on every render)
    // ════════════════════════════════════════════════════════════

    // ── totalSpentThisMonth ──────────────────────────────────────
    // Sum of all expense amounts whose date falls in the current month.
    // expense.date is 'YYYY-MM-DD', so slicing to 7 chars gives 'YYYY-MM'.
    const totalSpentThisMonth = useMemo(() => {
        return expenses
            .filter((e) => e.date?.slice(0, 7) === currentMonth)
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    }, [expenses, currentMonth])

    // ── expensesByCategory ───────────────────────────────────────
    // Object mapping each category to its total spend this month.
    // e.g. { Food: 1200, Transport: 500, Shopping: 3200 }
    // Only includes categories that have at least one expense.
    const expensesByCategory = useMemo(() => {
        return expenses
            .filter((e) => e.date?.slice(0, 7) === currentMonth)
            .reduce((acc, e) => {
                const cat = e.category || 'Other'
                acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0)
                return acc
            }, {})
    }, [expenses, currentMonth])

    // ── budgetStatus ─────────────────────────────────────────────
    // Array combining budget limits with actual spend for this month.
    // Each entry: { category, limit, spent, remaining, percentage }
    // Used by BudgetPage to render BudgetProgressBar components.
    //
    // Only includes categories that have a budget set for this month.
    // 'remaining' can be negative (over budget).
    // 'percentage' is capped at 100 for display purposes (real value kept in 'rawPct').
    const budgetStatus = useMemo(() => {
        // Filter budgets to current month only
        const thisMonthBudgets = budgets.filter(
            (b) => b.month === currentMonth
        )

        return thisMonthBudgets.map((budget) => {
            const spent = expensesByCategory[budget.category] || 0
            const limit = Number(budget.monthly_limit) || 0
            const remaining = limit - spent
            const rawPct = limit > 0 ? Math.round((spent / limit) * 100) : 0
            const percentage = Math.min(rawPct, 100) // cap at 100 for progress bar

            return {
                id: budget.id,
                category: budget.category,
                limit,
                spent,
                remaining,
                percentage,
                rawPct,         // actual % even if over 100 (for "over budget" logic)
                isOverBudget: spent > limit,
                isNearLimit: rawPct >= 80 && rawPct < 100,
            }
        })
    }, [budgets, expensesByCategory, currentMonth])

    // ── recentExpenses ───────────────────────────────────────────
    // The 5 most recent expenses across all months (for Dashboard preview).
    const recentExpenses = useMemo(() => {
        return [...expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
    }, [expenses])

    // ── Return everything ─────────────────────────────────────────
    return {
        // ── Raw data ──
        expenses,
        budgets,

        // ── Loading states ──
        expensesLoading,
        budgetsLoading,

        // ── Error states ──
        expensesError,
        budgetsError,

        // ── Action functions ──
        fetchExpenses,
        fetchBudgets,
        addExpense,
        deleteExpense,
        createBudget,

        // ── Computed values ──
        totalSpentThisMonth,
        expensesByCategory,
        budgetStatus,
        recentExpenses,

        // ── Utility ──
        currentMonth,
    }
}

export default useExpenses