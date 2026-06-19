import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import './LandingPage.css'

function LandingPage() {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    // If user is already logged in, send them straight to the dashboard
    // Wait for loading=false first — prevents wrong redirect on refresh
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, loading, navigate])

    // While the session check is in progress, render nothing to avoid flicker
    if (loading) return null

    const features = [
        {
            icon: '💸',
            title: 'Track Every Expense',
            description:
                'Log your daily spending by category — food, transport, shopping, and more. See exactly where your money goes.',
        },
        {
            icon: '🎯',
            title: 'Set Monthly Budgets',
            description:
                'Define spending limits per category each month. Get a clear picture of how much budget you have left.',
        },
        {
            icon: '📊',
            title: 'Visual Spending Charts',
            description:
                'Understand your habits at a glance with category breakdowns and spending charts on your dashboard.',
        },
    ]

    return (
        <div className="landing-page">

            {/* ── Minimal top bar ── */}
            <header className="landing-header">
                <span className="landing-brand">💰 ExpenseTracker</span>
                <Link to="/login" className="btn btn-secondary btn-sm">
                    Log in
                </Link>
            </header>

            {/* ── Hero section ── */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <div className="landing-hero-badge">Personal Finance Made Simple</div>
                    <h1 className="landing-hero-title">
                        Know where your <br />
                        <span className="landing-hero-highlight">money goes</span>
                    </h1>
                    <p className="landing-hero-subtitle">
                        Track expenses, set budgets, and understand your spending habits —
                        all in one clean, simple dashboard.
                    </p>
                    <div className="landing-hero-actions">
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Get Started — It&apos;s Free
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">
                            Log in
                        </Link>
                    </div>
                </div>

                {/* ── Decorative stats panel ── */}
                <div className="landing-hero-panel">
                    <div className="landing-stat-card">
                        <div className="landing-stat-row">
                            <span className="landing-stat-label">Total Spent This Month</span>
                            <span className="landing-stat-amount expense">₹ 14,250</span>
                        </div>
                        <div className="landing-stat-row">
                            <span className="landing-stat-label">Budget Remaining</span>
                            <span className="landing-stat-amount income">₹ 5,750</span>
                        </div>
                        <hr className="divider" />
                        <div className="landing-category-list">
                            {[
                                { name: 'Food', pct: 72, color: 'var(--color-cat-food)' },
                                { name: 'Transport', pct: 45, color: 'var(--color-cat-transport)' },
                                { name: 'Shopping', pct: 88, color: 'var(--color-cat-shopping)' },
                            ].map((cat) => (
                                <div key={cat.name} className="landing-category-row">
                                    <span className="landing-category-name">{cat.name}</span>
                                    <div className="landing-progress-track">
                                        <div
                                            className="landing-progress-fill"
                                            style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                                        />
                                    </div>
                                    <span className="landing-category-pct">{cat.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features section ── */}
            <section className="landing-features">
                <h2 className="landing-features-title">Everything you need</h2>
                <p className="landing-features-subtitle">
                    A focused set of tools to manage your personal finances without the clutter.
                </p>
                <div className="landing-features-grid">
                    {features.map((feature) => (
                        <div key={feature.title} className="landing-feature-card card">
                            <div className="landing-feature-icon">{feature.icon}</div>
                            <h3 className="landing-feature-title">{feature.title}</h3>
                            <p className="landing-feature-desc">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section className="landing-cta">
                <h2 className="landing-cta-title">Ready to take control?</h2>
                <p className="landing-cta-text">
                    Create your free account and start tracking in under a minute.
                </p>
                <Link to="/signup" className="btn btn-primary btn-lg">
                    Create Free Account
                </Link>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <span>© {new Date().getFullYear()} ExpenseTracker. Built with React + Supabase.</span>
            </footer>

        </div>
    )
}

export default LandingPage