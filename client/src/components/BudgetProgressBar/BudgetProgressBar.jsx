import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import CategoryBadge from '../CategoryBadge/CategoryBadge.jsx'
import './BudgetProgressBar.css'

// ── Currency formatter ────────────────────────────────────────────
const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(Number(amount)) || 0)

// Props:
//   budget (object) — one entry from budgetStatus array in useExpenses
function BudgetProgressBar({ budget }) {
    const {
        category,
        limit,
        spent,
        remaining,
        percentage,
        rawPct,
        isOverBudget,
        isNearLimit,
    } = budget

    // ── Determine colour variant based on health ──────────────────
    // over budget -> danger (red)
    // near limit  -> warning (amber)
    // under 80%   -> success (green)
    const variant = isOverBudget
        ? 'danger'
        : isNearLimit
            ? 'warning'
            : 'success'

    // ── Status icon + message ─────────────────────────────────────
    const statusIcon = isOverBudget ? (
        <AlertTriangle size={13} aria-hidden="true" />
    ) : isNearLimit ? (
        <TrendingUp size={13} aria-hidden="true" />
    ) : (
        <CheckCircle2 size={13} aria-hidden="true" />
    )

    const statusMsg = isOverBudget
        ? `${formatINR(Math.abs(remaining))} over budget`
        : isNearLimit
            ? `${formatINR(remaining)} remaining — almost at limit`
            : `${formatINR(remaining)} remaining`

    return (
        <div className={`budget-bar-wrapper budget-bar-${variant}`}>

            {/* ── Top row: category badge + limit ── */}
            <div className="budget-bar-top">
                <CategoryBadge category={category} />
                <span className="budget-bar-limit">
                    Limit: {formatINR(limit)}
                </span>
            </div>

            {/* ── Progress track ── */}
            <div
                className="budget-bar-track"
                role="progressbar"
                aria-valuenow={rawPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${category} budget: ${rawPct}% used`}
            >
                <div
                    className={`budget-bar-fill budget-bar-fill-${variant}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* ── Bottom row: spent + status message ── */}
            <div className="budget-bar-bottom">
                <span className="budget-bar-spent">
                    {formatINR(spent)} spent
                </span>
                <span className={`budget-bar-status budget-bar-status-${variant}`}>
                    {statusIcon}
                    {statusMsg}
                </span>
            </div>

        </div>
    )
}

export default BudgetProgressBar