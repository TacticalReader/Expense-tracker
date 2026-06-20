import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
    LayoutDashboard,
    Receipt,
    Target,
    LogOut,
    TrendingUp,
    User,
    X,
} from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import LogoutConfirmModal from '../LogoutConfirmModal/LogoutConfirmModal.jsx'
import './Sidebar.css'

// Props:
//   isOpen  (boolean)  — controls mobile overlay open/close
//   onClose (function) — called when overlay or X button is clicked
function Sidebar({ isOpen, onClose }) {
    const { user, logout, authLoading } = useAuth()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const displayName = user?.email?.split('@')[0] ?? 'User'
    const fullEmail = user?.email ?? ''

    // ── Body scroll lock on mobile ─────────────────────────────────
    // Prevents the page content from scrolling behind the sidebar backdrop
    // when the mobile drawer is open. Cleaned up on close or unmount.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const handleLogoutConfirm = async () => {
        setShowLogoutConfirm(false)
        onClose?.()
        await logout()
    }

    const navItems = [
        {
            to: '/dashboard',
            icon: <LayoutDashboard size={18} />,
            label: 'Dashboard',
        },
        {
            to: '/expenses',
            icon: <Receipt size={18} />,
            label: 'Expenses',
        },
        {
            to: '/budget',
            icon: <Target size={18} />,
            label: 'Budget',
        },
    ]

    return (
        <>
            {/* ── Mobile overlay backdrop ── */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar panel ── */}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>

                {/* ── Brand / Logo area ── */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <TrendingUp size={20} />
                    </div>
                    <span className="sidebar-brand-name">ExpenseTracker</span>
                    {/* Close button — only visible on mobile */}
                    <button
                        className="sidebar-close-btn"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Navigation links ── */}
                <nav className="sidebar-nav" aria-label="Main navigation">
                    <ul className="sidebar-nav-list">
                        {navItems.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `sidebar-nav-link ${isActive ? 'sidebar-nav-link-active' : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    <span className="sidebar-nav-icon">{item.icon}</span>
                                    <span className="sidebar-nav-label">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ── Bottom: user info + logout ── */}
                <div className="sidebar-bottom">
                    <div className="sidebar-divider" />

                    {/* User info */}
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            <User size={16} />
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name" title={fullEmail}>
                                {displayName}
                            </span>
                            <span className="sidebar-user-email" title={fullEmail}>
                                {fullEmail}
                            </span>
                        </div>
                    </div>

                    {/* Logout button */}
                    <button
                        className="sidebar-logout-btn"
                        onClick={() => setShowLogoutConfirm(true)}
                        disabled={authLoading}
                        aria-label="Log out"
                    >
                        <LogOut size={16} />
                        <span>Log out</span>
                    </button>
                </div>

            </aside>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogoutConfirm}
                isConfirming={authLoading}
            />
        </>
    )
}

export default Sidebar