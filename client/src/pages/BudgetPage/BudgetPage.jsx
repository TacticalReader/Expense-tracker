import { useState } from 'react'
import {
    Target,
    PlusCircle,
    AlertTriangle,
    RefreshCw,
    Wallet,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react'
import useExpenses from '../../hooks/useExpenses.js'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
// ⚠️ BudgetProgressBar is created in Phase 9
import BudgetProgressBar from '../../components/BudgetProgressBar/BudgetProgressBar.jsx'
import './BudgetPage.css'

const CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Health',
    'Housing', 'Education', 'Entertainment', 'Other',
]

// ── Currency formatter ────────────────────────────────────────────
const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

// ── Current month in 'YYYY-MM' for input[type=month] default ─────
const getCurrentMonthValue = () => new Date().toISOString().slice(0, 7)

function BudgetPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const {
        budgetsLoading,
        budgetsError,
        fetchBudgets,
        createBudget,
        budgetStatus,
        totalSpentThisMonth,
        currentMonth,
    } = useExpenses()

    // ── Budget form state ─────────────────────────────────────────
    const [category, setCategory] = useState('Food')
    const [monthlyLimit, setMonthlyLimit] = useState('')
    const [month, setMonth] = useState(getCurrentMonthValue)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')

    // ── Total budget limit this month (sum of all limits) ─────────
    const totalBudgetLimit = budgetStatus.reduce(
        (sum, b) => sum + (b.limit || 0), 0
    )
    const overallRemaining = totalBudgetLimit - totalSpentThisMonth

    // ── Budget form validation ────────────────────────────────────
    const validate = () => {
        if (!CATEGORIES.includes(category)) {
            setFormError('Please select a valid category.')
            return false
        }
        if (!monthlyLimit || isNaN(Number(monthlyLimit)) || Number(monthlyLimit) <= 0) {
            setFormError('Please enter a valid budget limit greater than zero.')
            return false
        }
        if (!month) {
            setFormError('Please select a month.')
            return false
        }
        return true
    }

    // ── Budget form submit ────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setFormSuccess('')

        if (!validate()) return

        setSubmitting(true)

        const result = await createBudget({
            category,
            monthly_limit: Number(monthlyLimit),
            month,
        })

        setSubmitting(false)

        if (result.success) {
            setFormSuccess(`Budget for ${category} saved successfully!`)
            setMonthlyLimit('')
            setTimeout(() => setFormSuccess(''), 3000)
        } else {
            setFormError(result.error || 'Failed to save budget. Please try again.')
        }
    }

    // ── Month label for display ───────────────────────────────────
    const monthLabel = currentMonth
        ? new Date(currentMonth + '-01T00:00:00').toLocaleDateString('en-IN', {
            month: 'long', year: 'numeric',
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
                    pageTitle="Budget"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <div className="app-content">

                    {/* ── Page header ── */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Budget</h1>
                            <p className="page-subtitle">
                                Set monthly spending limits per category
                            </p>
                        </div>
                    </div>

                    {/* ── Error banner ── */}
                    {budgetsError && (
                        <div className="budget-page-error" role="alert">
                            <AlertTriangle size={16} aria-hidden="true" />
                            <span>{budgetsError}</span>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={fetchBudgets}
                            >
                                <RefreshCw size={13} />
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="budget-page-body">

                        {/* ── Left column: form + overall summary ── */}
                        <div className="budget-page-left">

                            {/* Set budget form */}
                            <div className="card budget-form-card">
                                <div className="budget-form-header">
                                    <Target size={18} className="budget-form-header-icon" />
                                    <h2 className="budget-form-title">Set a Budget</h2>
                                </div>

                                <form
                                    className="budget-form"
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <div className="form-group">
                                        <label htmlFor="bf-category">
                                            Category <span className="budget-form-required">*</span>
                                        </label>
                                        <select
                                            id="bf-category"
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value); setFormError('') }}
                                            disabled={submitting}
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="bf-limit">
                                            Monthly Limit (₹){' '}
                                            <span className="budget-form-required">*</span>
                                        </label>
                                        <input
                                            id="bf-limit"
                                            type="number"
                                            placeholder="e.g. 5000"
                                            value={monthlyLimit}
                                            onChange={(e) => { setMonthlyLimit(e.target.value); setFormError('') }}
                                            disabled={submitting}
                                            min="1"
                                            step="1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="bf-month">
                                            Month <span className="budget-form-required">*</span>
                                        </label>
                                        <input
                                            id="bf-month"
                                            type="month"
                                            value={month}
                                            onChange={(e) => { setMonth(e.target.value); setFormError('') }}
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Form error */}
                                    {formError && (
                                        <div className="budget-form-msg budget-form-msg-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            <span>{formError}</span>
                                        </div>
                                    )}

                                    {/* Form success */}
                                    {formSuccess && (
                                        <div className="budget-form-msg budget-form-msg-success" role="status">
                                            <CheckCircle2 size={14} aria-hidden="true" />
                                            <span>{formSuccess}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary budget-form-submit"
                                        disabled={submitting}
                                    >
                                        <PlusCircle size={16} aria-hidden="true" />
                                        {submitting ? 'Saving...' : 'Save Budget'}
                                    </button>
                                </form>
                            </div>

                            {/* Overall summary card */}
                            {budgetStatus.length > 0 && (
                                <div className="card budget-summary-card">
                                    <h3 className="budget-summary-title">
                                        {monthLabel} Summary
                                    </h3>
                                    <div className="budget-summary-rows">
                                        <div className="budget-summary-row">
                                            <span className="budget-summary-label">
                                                Total Budget
                                            </span>
                                            <span className="budget-summary-value">
                                                {formatINR(totalBudgetLimit)}
                                            </span>
                                        </div>
                                        <div className="budget-summary-row">
                                            <span className="budget-summary-label">
                                                Total Spent
                                            </span>
                                            <span
                                                className="budget-summary-value"
                                                style={{ color: 'var(--color-danger)' }}
                                            >
                                                {formatINR(totalSpentThisMonth)}
                                            </span>
                                        </div>
                                        <div className="budget-summary-divider" />
                                        <div className="budget-summary-row">
                                            <span className="budget-summary-label">
                                                Remaining
                                            </span>
                                            <span
                                                className="budget-summary-value budget-summary-remaining"
                                                style={{
                                                    color: overallRemaining >= 0
                                                        ? 'var(--color-success)'
                                                        : 'var(--color-danger)',
                                                }}
                                            >
                                                {formatINR(Math.abs(overallRemaining))}
                                                {overallRemaining < 0 ? ' over' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* ── Right column: budget progress bars ── */}
                        <div className="budget-page-right">
                            <div className="card budget-status-card">
                                <div className="budget-status-header">
                                    <h2 className="budget-status-title">
                                        Budget Status
                                    </h2>
                                    <span className="budget-status-month">{monthLabel}</span>
                                </div>

                                {/* Loading */}
                                {budgetsLoading && (
                                    <div className="budget-status-loading">
                                        <LoadingSpinner size="sm" message="Loading budgets..." />
                                    </div>
                                )}

                                {/* No budgets set */}
                                {!budgetsLoading && budgetStatus.length === 0 && (
                                    <div className="empty-state">
                                        <Target
                                            size={36}
                                            className="empty-state-icon"
                                            aria-hidden="true"
                                        />
                                        <p className="empty-state-title">No budgets set</p>
                                        <p className="empty-state-text">
                                            Use the form to set a monthly spending limit
                                            for each category you want to track.
                                        </p>
                                    </div>
                                )}

                                {/* Budget progress list */}
                                {!budgetsLoading && budgetStatus.length > 0 && (
                                    <div className="budget-status-list">
                                        {budgetStatus.map((budget) => (
                                            <BudgetProgressBar
                                                key={budget.id}
                                                budget={budget}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default BudgetPage