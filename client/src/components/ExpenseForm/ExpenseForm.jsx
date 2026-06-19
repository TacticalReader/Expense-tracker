import { useState } from 'react'
import {
    PlusCircle,
    AlertCircle,
    CheckCircle2,
    Receipt,
} from 'lucide-react'
import useExpenses from '../../hooks/useExpenses.js'
import './ExpenseForm.css'

// All valid expense categories — must match backend enum
const CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Health',
    'Housing',
    'Education',
    'Entertainment',
    'Other',
]

// Today's date in 'YYYY-MM-DD' format for the default date field
const getTodayString = () => new Date().toISOString().split('T')[0]

// Props:
//   onSuccess (function) — called after a successful add (optional)
//                          parent can use this to close a modal etc.
function ExpenseForm({ onSuccess }) {
    const { addExpense } = useExpenses()

    // ── Form field state ──────────────────────────────────────────
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('Food')
    const [date, setDate] = useState(getTodayString)
    const [note, setNote] = useState('')

    // ── UI state ──────────────────────────────────────────────────
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    // ── Validation ────────────────────────────────────────────────
    const validate = () => {
        if (!title.trim()) {
            setFormError('Please enter a title for the expense.')
            return false
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setFormError('Please enter a valid amount greater than zero.')
            return false
        }
        if (!CATEGORIES.includes(category)) {
            setFormError('Please select a valid category.')
            return false
        }
        if (!date) {
            setFormError('Please select a date.')
            return false
        }
        return true
    }

    // ── Reset form to initial state ───────────────────────────────
    const resetForm = () => {
        setTitle('')
        setAmount('')
        setCategory('Food')
        setDate(getTodayString())
        setNote('')
        setFormError('')
    }

    // ── Submit handler ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSuccessMsg('')

        if (!validate()) return

        setSubmitting(true)

        const result = await addExpense({
            title: title.trim(),
            amount: Number(amount),
            category,
            date,
            note: note.trim(),
        })

        setSubmitting(false)

        if (result.success) {
            setSuccessMsg('Expense added successfully!')
            resetForm()
            onSuccess?.()
            // Clear the success message after 3 seconds
            setTimeout(() => setSuccessMsg(''), 3000)
        } else {
            setFormError(result.error || 'Failed to add expense. Please try again.')
        }
    }

    return (
        <div className="expense-form-wrapper card">

            {/* ── Form header ── */}
            <div className="expense-form-header">
                <Receipt size={18} className="expense-form-header-icon" />
                <h2 className="expense-form-title">Add New Expense</h2>
            </div>

            <form className="expense-form" onSubmit={handleSubmit} noValidate>

                {/* ── Row 1: Title + Amount ── */}
                <div className="expense-form-row">
                    <div className="form-group">
                        <label htmlFor="ef-title">Title <span className="expense-form-required">*</span></label>
                        <input
                            id="ef-title"
                            type="text"
                            placeholder="e.g. Grocery shopping"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setFormError('') }}
                            disabled={submitting}
                            maxLength={100}
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ef-amount">Amount (₹) <span className="expense-form-required">*</span></label>
                        <input
                            id="ef-amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value); setFormError('') }}
                            disabled={submitting}
                            min="0.01"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* ── Row 2: Category + Date ── */}
                <div className="expense-form-row">
                    <div className="form-group">
                        <label htmlFor="ef-category">Category <span className="expense-form-required">*</span></label>
                        <select
                            id="ef-category"
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
                        <label htmlFor="ef-date">Date <span className="expense-form-required">*</span></label>
                        <input
                            id="ef-date"
                            type="date"
                            value={date}
                            onChange={(e) => { setDate(e.target.value); setFormError('') }}
                            disabled={submitting}
                            max={getTodayString()}
                        />
                    </div>
                </div>

                {/* ── Note (full width) ── */}
                <div className="form-group">
                    <label htmlFor="ef-note">Note <span className="expense-form-optional">(optional)</span></label>
                    <textarea
                        id="ef-note"
                        placeholder="Any extra details..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={submitting}
                        maxLength={300}
                        rows={2}
                    />
                </div>

                {/* ── Error message ── */}
                {formError && (
                    <div className="expense-form-error" role="alert">
                        <AlertCircle size={15} aria-hidden="true" />
                        <span>{formError}</span>
                    </div>
                )}

                {/* ── Success message ── */}
                {successMsg && (
                    <div className="expense-form-success" role="status">
                        <CheckCircle2 size={15} aria-hidden="true" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* ── Submit button ── */}
                <button
                    type="submit"
                    className="btn btn-primary expense-form-submit"
                    disabled={submitting}
                >
                    <PlusCircle size={16} aria-hidden="true" />
                    {submitting ? 'Adding...' : 'Add Expense'}
                </button>

            </form>
        </div>
    )
}

export default ExpenseForm