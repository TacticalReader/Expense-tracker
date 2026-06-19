import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    Wallet,
    Receipt,
    TrendingUp,
    Target,
    ArrowRight,
} from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import useExpenses from '../../hooks/useExpenses.js'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import SummaryWidget from '../../components/SummaryWidget/SummaryWidget.jsx'
import SpendingChart from '../../components/SpendingChart/SpendingChart.jsx'
import ExpenseCard from '../../components/ExpenseCard/ExpenseCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx'
import './DashboardPage.css'

// ── Greeting based on time of day ─────────────────────────────────
const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}

// ── Currency formatter ────────────────────────────────────────────
const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0)

// ── Month label formatter — 'YYYY-MM' → 'June 2026' ──────────────
const formatMonthLabel = (ym) => {
    if (!ym) return ''
    return new Date(ym + '-01T00:00:00').toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
    })
}

function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuth()

    const {
        expenses,
        expensesLoading,
        totalSpentThisMonth,
        expensesByCategory,
        budgetStatus,
        recentExpenses,
        deleteExpense,
        currentMonth,
    } = useExpenses()

    // Display name — part before '@' in email
    const displayName = user?.email?.split('@')[0] ?? 'there'

    // ── Computed widget values ────────────────────────────────────

    // Count of expenses in current month
    const thisMonthCount = useMemo(() =>
        expenses.filter((e) => e.date?.slice(0, 7) === currentMonth).length,
        [expenses, currentMonth])

    // Top spending category this month
    const topCategory = useMemo(() => {
        const entries = Object.entries(expensesByCategory)
        if (!entries.length) return '—'
        return entries.sort((a, b) => b[1] - a[1])[0][0]
    }, [expensesByCategory])

    // Budget health: how many budgets are within limit
    const budgetsOnTrack = budgetStatus.filter((b) => !b.isOverBudget).length
    const totalBudgets = budgetStatus.length
    const allOnTrack = totalBudgets > 0 && budgetsOnTrack === totalBudgets

    return (
        <div className="app-shell">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="app-main">
                <Navbar
                    pageTitle="Dashboard"
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <div className="app-content">

                    {/* ── Page header ── */}
                    <div className="page-header dashboard-header">
                        <div>
                            <h1 className="page-title">
                                {getGreeting()}, {displayName} 👋
                            </h1>
                            <p className="page-subtitle">
                                Here&apos;s your financial overview for{' '}
                                {formatMonthLabel(currentMonth)}.
                            </p>
                        </div>
                    </div>

                    {/* ── 4 Summary Widgets ── */}
                    {expensesLoading ? (
                        <div className="dashboard-widgets-loading">
                            <LoadingSpinner size="md" message="Loading your data..." />
                        </div>
                    ) : (
                        <div className="grid-4 dashboard-widgets">
                            <SummaryWidget
                                title="Total Spent"
                                value={formatINR(totalSpentThisMonth)}
                                subtitle={formatMonthLabel(currentMonth)}
                                icon={<Wallet size={20} />}
                                variant="danger"
                            />
                            <SummaryWidget
                                title="Transactions"
                                value={String(thisMonthCount)}
                                subtitle="expenses this month"
                                icon={<Receipt size={20} />}
                                variant="default"
                            />
                            <SummaryWidget
                                title="Top Category"
                                value={topCategory}
                                subtitle="highest spending"
                                icon={<TrendingUp size={20} />}
                                variant="warning"
                            />
                            <SummaryWidget
                                title="Budget Health"
                                value={
                                    totalBudgets === 0
                                        ? 'No budgets'
                                        : `${budgetsOnTrack} / ${totalBudgets}`
                                }
                                subtitle={
                                    totalBudgets === 0
                                        ? 'Set budgets to track'
                                        : allOnTrack
                                            ? 'all within limit ✓'
                                            : 'budgets within limit'
                                }
                                icon={<Target size={20} />}
                                variant={
                                    totalBudgets === 0
                                        ? 'default'
                                        : allOnTrack
                                            ? 'success'
                                            : 'danger'
                                }
                            />
                        </div>
                    )}

                    {/* ── Main content: Chart + Recent Expenses ── */}
                    <div className="dashboard-main-grid">

                        {/* Left: Spending chart */}
                        <div className="dashboard-chart-col">
                            <SpendingChart
                                expenses={expenses}
                                currentMonth={currentMonth}
                            />
                        </div>

                        {/* Right: Recent transactions */}
                        <div className="dashboard-recent-col">
                            <div className="card dashboard-recent-card">

                                <div className="dashboard-recent-header">
                                    <h2 className="dashboard-recent-title">
                                        Recent Transactions
                                    </h2>
                                    <Link
                                        to="/expenses"
                                        className="dashboard-recent-link"
                                    >
                                        View all
                                        <ArrowRight size={14} aria-hidden="true" />
                                    </Link>
                                </div>

                                {expensesLoading ? (
                                    <LoadingSpinner size="sm" message="Loading..." />
                                ) : recentExpenses.length === 0 ? (
                                    <div className="empty-state dashboard-empty">
                                        <Receipt
                                            size={32}
                                            className="empty-state-icon"
                                            aria-hidden="true"
                                        />
                                        <p className="empty-state-title">No transactions yet</p>
                                        <p className="empty-state-text">
                                            Add your first expense on the{' '}
                                            <Link to="/expenses" className="dashboard-empty-link">
                                                Expenses
                                            </Link>{' '}
                                            page.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="dashboard-recent-list">
                                        {recentExpenses.map((expense) => (
                                            <ExpenseCard
                                                key={expense.id}
                                                expense={expense}
                                                onDelete={deleteExpense}
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

export default DashboardPage