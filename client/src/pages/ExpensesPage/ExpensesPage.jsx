import { useState } from 'react'
import {
    Wallet,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react'
import useExpenses from '../../hooks/useExpenses.js'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import ExpenseForm from '../../components/ExpenseForm/ExpenseForm.jsx'
import ExpenseList from '../../components/ExpenseList/ExpenseList.jsx'
import './ExpensesPage.css'

// ── Currency formatter ────────────────────────────────────────────
const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

function ExpensesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const {
        expenses,
        expensesLoading,
        expensesError,
        fetchExpenses,
        deleteExpense,
        totalSpentThisMonth,
        currentMonth,
    } = useExpenses()

    // Month label for display
    const monthLabel = currentMonth
        ? new Date(currentMonth + '-01T00:00:00').toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
        })
        : ''

    return (
        <div className="app-shell">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="app-main">
                <Navbar
                    pageTitle="Expenses"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <div className="app-content">

                    {/* ── Page header ── */}
                    <div className="page-header expenses-page-header">
                        <div>
                            <h1 className="page-title">Expenses</h1>
                            <p className="page-subtitle">
                                Track and manage all your spending
                            </p>
                        </div>

                        {/* Total this month badge */}
                        <div className="expenses-page-total">
                            <Wallet size={16} aria-hidden="true" />
                            <span className="expenses-page-total-label">
                                {monthLabel}:
                            </span>
                            <span className="expenses-page-total-value">
                                {formatINR(totalSpentThisMonth)}
                            </span>
                        </div>
                    </div>

                    {/* ── Error banner ── */}
                    {expensesError && (
                        <div className="expenses-page-error" role="alert">
                            <AlertTriangle size={16} aria-hidden="true" />
                            <span>{expensesError}</span>
                            <button
                                className="btn btn-secondary btn-sm expenses-page-retry"
                                onClick={fetchExpenses}
                            >
                                <RefreshCw size={13} />
                                Retry
                            </button>
                        </div>
                    )}

                    {/* ── Page body: form + list ── */}
                    <div className="expenses-page-body">

                        {/* Add expense form */}
                        <ExpenseForm />

                        {/* Expense list with filters */}
                        <ExpenseList
                            expenses={expenses}
                            onDelete={deleteExpense}
                            loading={expensesLoading}
                            showFilters
                        />

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ExpensesPage