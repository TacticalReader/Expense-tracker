import { TrendingUp, TrendingDown } from 'lucide-react'
import './SummaryWidget.css'

// Props:
//   title    (string)    — label above the value e.g. "Total Spent"
//   value    (string)    — the big number e.g. "₹ 14,250"
//   subtitle (string)    — small text below value e.g. "This month"
//   icon     (ReactNode) — Lucide icon passed from parent e.g. <Wallet size={20} />
//   variant  (string)    — 'default' | 'danger' | 'success' | 'warning'
//   trend    (string)    — optional trend label e.g. "+12% vs last month"
//   trendUp  (boolean)   — true = green arrow up, false = red arrow down
function SummaryWidget({
    title = '',
    value = '—',
    subtitle = '',
    icon = null,
    variant = 'default',
    trend = '',
    trendUp = true,
}) {
    return (
        <div className={`widget card widget-${variant}`}>

            {/* ── Top row: title + icon ── */}
            <div className="widget-header">
                <span className="widget-title">{title}</span>
                {icon && (
                    <div className={`widget-icon-wrap widget-icon-${variant}`}>
                        {icon}
                    </div>
                )}
            </div>

            {/* ── Main value ── */}
            <div className="widget-value">{value}</div>

            {/* ── Bottom row: subtitle + trend ── */}
            <div className="widget-footer">
                {subtitle && (
                    <span className="widget-subtitle">{subtitle}</span>
                )}
                {trend && (
                    <span
                        className={`widget-trend ${trendUp ? 'widget-trend-up' : 'widget-trend-down'}`}
                    >
                        {trendUp
                            ? <TrendingUp size={12} aria-hidden="true" />
                            : <TrendingDown size={12} aria-hidden="true" />
                        }
                        {trend}
                    </span>
                )}
            </div>

        </div>
    )
}

export default SummaryWidget