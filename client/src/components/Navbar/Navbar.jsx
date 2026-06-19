import { Menu, LogOut, Bell, User } from 'lucide-react'
import useAuth from '../../hooks/useAuth.js'
import './Navbar.css'

// Props:
//   pageTitle  (string)   — title shown in the top bar e.g. "Dashboard"
//   onMenuClick (function) — called when hamburger is clicked (mobile sidebar toggle)
function Navbar({ pageTitle = 'Dashboard', onMenuClick }) {
    const { user, logout, authLoading } = useAuth()

    // Show only the part before '@' as a short display name
    const displayName = user?.email?.split('@')[0] ?? 'User'
    const fullEmail = user?.email ?? ''

    const handleLogout = async () => {
        await logout()
        // After logout, AuthContext clears user → ProtectedRoute
        // redirects to /login automatically. No navigate() needed here.
    }

    return (
        <header className="navbar">

            {/* ── Left side: hamburger + page title ── */}
            <div className="navbar-left">
                <button
                    className="navbar-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
                <h1 className="navbar-title">{pageTitle}</h1>
            </div>

            {/* ── Right side: bell + user + logout ── */}
            <div className="navbar-right">

                {/* Notification bell — decorative for now */}
                <button className="navbar-icon-btn" aria-label="Notifications" title="Notifications">
                    <Bell size={18} />
                </button>

                {/* User info */}
                <div className="navbar-user" title={fullEmail}>
                    <div className="navbar-avatar">
                        <User size={14} />
                    </div>
                    <span className="navbar-username">{displayName}</span>
                </div>

                {/* Logout button */}
                <button
                    className="navbar-logout-btn"
                    onClick={handleLogout}
                    disabled={authLoading}
                    title="Log out"
                    aria-label="Log out"
                >
                    <LogOut size={16} />
                    <span className="navbar-logout-text">
                        {authLoading ? 'Logging out...' : 'Logout'}
                    </span>
                </button>

            </div>
        </header>
    )
}

export default Navbar