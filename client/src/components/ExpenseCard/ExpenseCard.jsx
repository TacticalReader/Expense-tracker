import { useState } from 'react'
import { Trash2, Check, X, FileText } from 'lucide-react'
import CategoryBadge from '../CategoryBadge/CategoryBadge.jsx'
import './ExpenseCard.css'

// ── Date formatter ────────────────────────────────────────────────
// Adding T00:00:00 forces local midnight — prevents timezone offset
// from shifting the date one day back in some environments.
// Result: '15 Jun 2026'
const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// ── Currency formatter ────────────────────────────────────────────
// Result: '₹1,250' or '₹1,250.50'
const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0)
}

// Props:
//   expense  (object)   — { id, title, amount, category, date, note }
//   onDelete (function) — called with expense.id when delete is confirmed
function ExpenseCard({ expense, onDelete }) {
    // Two-step delete: first click shows confirm buttons, second deletes
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDeleteClick = () => setConfirmDelete(true)
    const handleCancelDelete = () => setConfirmDelete(false)

    const handleConfirmDelete = async () => {
        setDeleting(true)
        await onDelete(expense.id)
        // Note: if optimistic delete works correctly (Phase 6),
        // this card unmounts before setDeleting(false) is needed.
        // But set it anyway as a safety net.
        setDeleting(false)
        setConfirmDelete(false)
    }

    return (
        <div className={`expense-card ${deleting ? 'expense-card-deleting' : ''}`}>

            {/* ── Left: category badge + title + note ── */}
            <div className="expense-card-left">
                <CategoryBadge category={expense.category} />
                <div className="expense-card-info">
                    <span className="expense-card-title">{expense.title}</span>
                    {expense.note && (
                        <span className="expense-card-note">
                            <FileText size={11} aria-hidden="true" />
                            {expense.note}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Right: date + amount + delete ── */}
            <div className="expense-card-right">
                <span className="expense-card-date">{formatDate(expense.date)}</span>

                <span className="expense-card-amount amount-expense">
                    {formatAmount(expense.amount)}
                </span>

                {/* ── Delete controls ── */}
                {!confirmDelete ? (
                    <button
                        className="expense-card-delete-btn"
                        onClick={handleDeleteClick}
                        aria-label={`Delete expense: ${expense.title}`}
                        title="Delete expense"
                    >
                        <Trash2 size={15} />
                    </button>
                ) : (
                    <div className="expense-card-confirm">
                        <span className="expense-card-confirm-text">Delete?</span>
                        <button
                            className="expense-card-confirm-yes"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            aria-label="Confirm delete"
                            title="Confirm delete"
                        >
                            <Check size={13} />
                        </button>
                        <button
                            className="expense-card-confirm-no"
                            onClick={handleCancelDelete}
                            aria-label="Cancel delete"
                            title="Cancel"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpenseCard