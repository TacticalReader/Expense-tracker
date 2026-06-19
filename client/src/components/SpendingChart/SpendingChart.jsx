import { useState, useMemo } from 'react'
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts'
import {
    PieChart as PieChartIcon,
    BarChart2,
    TrendingUp,
} from 'lucide-react'
import './SpendingChart.css'

// ── Category colors (hex) — must match global.css CSS variables ──
// Recharts renders to SVG and cannot read CSS custom properties,
// so we hardcode the same values here.
const CATEGORY_COLORS = {
    Food: '#f97316',
    Transport: '#0ea5e9',
    Shopping: '#a855f7',
    Health: '#10b981',
    Housing: '#f59e0b',
    Education: '#3b82f6',
    Entertainment: '#ec4899',
    Other: '#6b7280',
}

// ── Currency formatter (short form for chart axes) ────────────────
const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: 'compact',
    }).format(value)

// ── Custom tooltip for both charts ───────────────────────────────
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value } = payload[0]
    return (
        <div className="chart-tooltip">
            <span className="chart-tooltip-label">{name}</span>
            <span className="chart-tooltip-value">
                {new Intl.NumberFormat('en-IN', {
                    style: 'currency', currency: 'INR',
                    minimumFractionDigits: 0, maximumFractionDigits: 2,
                }).format(value)}
            </span>
        </div>
    )
}

// Props:
//   expenses     (array)  — all expenses; this component filters to currentMonth
//   currentMonth (string) — 'YYYY-MM' e.g. '2026-06'
function SpendingChart({ expenses = [], currentMonth }) {
    const [activeChart, setActiveChart] = useState('pie')

    // ── Data for PIE chart: totals per category this month ───────
    const pieData = useMemo(() => {
        const totals = expenses
            .filter((e) => e.date?.slice(0, 7) === currentMonth)
            .reduce((acc, e) => {
                const cat = e.category || 'Other'
                acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0)
                return acc
            }, {})

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value) // biggest slice first
    }, [expenses, currentMonth])

    // ── Data for BAR chart: total per day this month ─────────────
    const barData = useMemo(() => {
        const dailyTotals = expenses
            .filter((e) => e.date?.slice(0, 7) === currentMonth)
            .reduce((acc, e) => {
                const day = Number(e.date?.split('-')[2]) // day of month: 1-31
                acc[day] = (acc[day] || 0) + (Number(e.amount) || 0)
                return acc
            }, {})

        return Object.entries(dailyTotals)
            .map(([day, total]) => ({ name: `${day}`, value: total }))
            .sort((a, b) => Number(a.name) - Number(b.name))
    }, [expenses, currentMonth])

    // ── Month label for display ───────────────────────────────────
    const monthLabel = currentMonth
        ? new Date(currentMonth + '-01T00:00:00').toLocaleDateString('en-IN', {
            month: 'long', year: 'numeric',
        })
        : ''

    // ── No data state ─────────────────────────────────────────────
    const hasData = pieData.length > 0

    return (
        <div className="chart-wrapper card">

            {/* ── Header ── */}
            <div className="chart-header">
                <div className="chart-title-group">
                    <TrendingUp size={18} className="chart-header-icon" aria-hidden="true" />
                    <div>
                        <h2 className="chart-title">Spending Overview</h2>
                        {monthLabel && (
                            <p className="chart-subtitle">{monthLabel}</p>
                        )}
                    </div>
                </div>

                {/* ── Chart type toggle ── */}
                <div className="chart-toggle" role="group" aria-label="Chart type">
                    <button
                        className={`chart-toggle-btn ${activeChart === 'pie' ? 'chart-toggle-active' : ''}`}
                        onClick={() => setActiveChart('pie')}
                        aria-pressed={activeChart === 'pie'}
                        title="Category breakdown"
                    >
                        <PieChartIcon size={15} />
                        <span>By Category</span>
                    </button>
                    <button
                        className={`chart-toggle-btn ${activeChart === 'bar' ? 'chart-toggle-active' : ''}`}
                        onClick={() => setActiveChart('bar')}
                        aria-pressed={activeChart === 'bar'}
                        title="Daily trend"
                    >
                        <BarChart2 size={15} />
                        <span>Daily Trend</span>
                    </button>
                </div>
            </div>

            {/* ── No data state ── */}
            {!hasData && (
                <div className="chart-empty empty-state">
                    <TrendingUp size={36} className="empty-state-icon" aria-hidden="true" />
                    <p className="empty-state-title">No spending data</p>
                    <p className="empty-state-text">
                        Add some expenses for {monthLabel} to see your spending charts.
                    </p>
                </div>
            )}

            {/* ── PIE CHART ── */}
            {hasData && activeChart === 'pie' && (
                <div className="chart-body">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {pieData.map((entry) => (
                                    <Cell
                                        key={entry.name}
                                        fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => (
                                    <span className="chart-legend-label">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* ── Category breakdown table below pie ── */}
                    <div className="chart-category-list">
                        {pieData.map((entry) => {
                            const total = pieData.reduce((s, d) => s + d.value, 0)
                            const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
                            return (
                                <div key={entry.name} className="chart-category-row">
                                    <span
                                        className="chart-category-dot"
                                        style={{ backgroundColor: CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other }}
                                        aria-hidden="true"
                                    />
                                    <span className="chart-category-name">{entry.name}</span>
                                    <span className="chart-category-pct">{pct}%</span>
                                    <span className="chart-category-amount">
                                        {formatCurrency(entry.value)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── BAR CHART ── */}
            {hasData && activeChart === 'bar' && (
                <div className="chart-body">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={barData}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: 'Day of Month', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }}
                            />
                            <YAxis
                                tickFormatter={formatCurrency}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                width={56}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#eff6ff' }} />
                            <Bar
                                dataKey="value"
                                name="Amount"
                                fill="#2563eb"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    )
}

export default SpendingChart