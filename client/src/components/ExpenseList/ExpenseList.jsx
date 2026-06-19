import { useState, useMemo } from 'react'
import {
    Search,
    SlidersHorizontal,
    Receipt,
    X,
    Filter,
} from 'lucide-react'
import ExpenseCard from '../ExpenseCard/ExpenseCard.jsx'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx'
import './ExpenseList.css'

const CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Health',
    'Housing', 'Education', 'Entertainment', 'Other',
]

// ── Helper: get unique months from expenses ───────────────────────
// Returns array of 'YYYY-MM' strings, newest first
const getUniqueMonths = (expenses) => {
    const months = [...new Set(
        expenses.map((e) => e.date?.slice(0, 7)).filter(Boolean)
    )]
    return months.sort((a, b) => b.localeCompare(a))
}

// ── Helper: format 'YYYY-MM' to 'June 2026' ──────────────────────
const formatMonthLabel = (ym) => {
    const [year, month] = ym.split('-')
    return new Date(Number(year), Number(month) - 1, 1)
        .toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

// Props:
//   expenses     (array)    — full expense list from useExpenses
//   onDelete     (function) — passed to each ExpenseCard
//   loading      (boolean)  — show spinner while backend is fetching
//   showFilters  (boolean)  — default true; set false to hide filter bar
function ExpenseList({
    expenses = [],
    onDelete,
    loading = false,
    showFilters = true,
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedMonth, setSelectedMonth] = useState('All')
    const [sortBy, setSortBy] = useState('date-desc')

    // Unique months derived from the expense list
    const uniqueMonths = useMemo(() => getUniqueMonths(expenses), [expenses])

    // ── Client-side filtered + sorted list ───────────────────────
    const filteredExpenses = useMemo(() => {
        let result = [...expenses]

        // Filter by search query (title match, case-insensitive)
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase()
            result = result.filter((e) =>
                e.title?.toLowerCase().includes(q) ||
                e.note?.toLowerCase().includes(q)
            )
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter((e) => e.category === selectedCategory)
        }

        // Filter by month
        if (selectedMonth !== 'All') {
            result = result.filter((e) => e.date?.slice(0, 7) === selectedMonth)
        }

        // Sort
        switch (sortBy) {
            case 'date-desc':
                result.sort((a, b) => new Date(b.date) - new Date(a.date))
                break
            case 'date-asc':
                result.sort((a, b) => new Date(a.date) - new Date(b.date))
                break
            case 'amount-desc':
                result.sort((a, b) => Number(b.amount) - Number(a.amount))
                break
            case 'amount-asc':
                result.sort((a, b) => Number(a.amount) - Number(b.amount))
                break
            default:
                break
        }

        return result
    }, [expenses, searchQuery, selectedCategory, selectedMonth, sortBy])

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        selectedCategory !== 'All' ||
        selectedMonth !== 'All'

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedCategory('All')
        setSelectedMonth('All')
        setSortBy('date-desc')
    }

    // ── Loading state ─────────────────────────────────────────────
    if (loading) {
        return (
            <div className="expense-list-loading">
                <LoadingSpinner size="md" message="Loading expenses..." />
            </div>
        )
    }

    return (
        <div className="expense-list-wrapper">

            {/* ── Filter bar ── */}
            {showFilters && (
                <div className="expense-list-filters card">

                    {/* Search input */}
                    <div className="expense-list-search">
                        <Search size={15} className="expense-list-search-icon" aria-hidden="true" />
                        <input
                            type="text"
                            className="expense-list-search-input"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="expense-list-search-clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Filter controls row */}
                    <div className="expense-list-controls">
                        <div className="expense-list-control-group">
                            <Filter size={13} aria-hidden="true" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="expense-list-select"
                                aria-label="Filter by category"
                            >
                                <option value="All">All Categories</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="expense-list-control-group">
                            <Filter size={13} aria-hidden="true" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="expense-list-select"
                                aria-label="Filter by month"
                            >
                                <option value="All">All Months</option>
                                {uniqueMonths.map((ym) => (
                                    <option key={ym} value={ym}>{formatMonthLabel(ym)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="expense-list-control-group">
                            <SlidersHorizontal size={13} aria-hidden="true" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="expense-list-select"
                                aria-label="Sort expenses"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Highest Amount</option>
                                <option value="amount-asc">Lowest Amount</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                className="expense-list-clear-btn btn btn-ghost btn-sm"
                                onClick={clearFilters}
                            >
                                <X size={13} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Result count */}
                    <div className="expense-list-count">
                        Showing <strong>{filteredExpenses.length}</strong> of{' '}
                        <strong>{expenses.length}</strong> expense
                        {expenses.length !== 1 ? 's' : ''}
                    </div>
                </div>
            )}

            {/* ── Empty state: no expenses at all ── */}
            {expenses.length === 0 && (
                <div className="empty-state">
                    <Receipt size={40} className="empty-state-icon" aria-hidden="true" />
                    <p className="empty-state-title">No expenses yet</p>
                    <p className="empty-state-text">
                        Add your first expense using the form above.
                    </p>
                </div>
            )}

            {/* ── Empty state: filters returned nothing ── */}
            {expenses.length > 0 && filteredExpenses.length === 0 && (
                <div className="empty-state">
                    <Search size={40} className="empty-state-icon" aria-hidden="true" />
                    <p className="empty-state-title">No matching expenses</p>
                    <p className="empty-state-text">
                        Try adjusting your search or filters.
                    </p>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={clearFilters}
                        style={{ marginTop: 'var(--spacing-md)' }}
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── Expense cards ── */}
            {filteredExpenses.length > 0 && (
                <div className="expense-list-cards">
                    {filteredExpenses.map((expense) => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default ExpenseList