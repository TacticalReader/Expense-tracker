import { createContext, useContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'

// ── Create the context ────────────────────────────────────────────
// Default value is null — components must be inside <ExpenseProvider>
// to access it. useExpenses throws a clear error if used outside.
export const ExpenseContext = createContext(null)

// ── ExpenseProvider component ─────────────────────────────────────
// Already used in App.jsx (Phase 1) wrapping all routes.
// Makes the full expense + budget store available to every component.
export function ExpenseProvider({ children }) {

    // ── Expenses — initialized from localStorage ──────────────────
    // Key 'et_expenses' (et_ prefix = ExpenseTracker, avoids clashes)
    // useLocalStorage returns [value, setter] exactly like useState,
    // but calling the setter also writes to localStorage automatically.
    // This means the very first render shows cached data from last session.
    const [expenses, setExpenses] = useLocalStorage('et_expenses', [])

    // ── Budgets — initialized from localStorage ───────────────────
    const [budgets, setBudgets] = useLocalStorage('et_budgets', [])

    // ── Loading flags ─────────────────────────────────────────────
    // These are plain useState (not localStorage) because loading
    // state should never persist across sessions — always starts false.
    const [expensesLoading, setExpensesLoading] = useState(false)
    const [budgetsLoading, setBudgetsLoading] = useState(false)

    // ── Error strings ─────────────────────────────────────────────
    // null = no error, string = error message to display
    const [expensesError, setExpensesError] = useState(null)
    const [budgetsError, setBudgetsError] = useState(null)

    // ── Context value ─────────────────────────────────────────────
    // Expose BOTH the values and their setters.
    // useExpenses consumes these setters to update state + localStorage
    // in one shot (because setExpenses from useLocalStorage handles both).
    const contextValue = {
        // Expense data + setter
        expenses,
        setExpenses,

        // Budget data + setter
        budgets,
        setBudgets,

        // Loading flags + setters
        expensesLoading,
        setExpensesLoading,
        budgetsLoading,
        setBudgetsLoading,

        // Error strings + setters
        expensesError,
        setExpensesError,
        budgetsError,
        setBudgetsError,
    }

    return (
        <ExpenseContext.Provider value={contextValue}>
            {children}
        </ExpenseContext.Provider>
    )
}