import { Routes, Route, Navigate } from 'react-router-dom'

// ── Contexts (created in Phase 3 and Phase 6) ─────────────────
import { AuthProvider } from './context/AuthContext.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'

// ── Route Guard (created in Phase 5) ─────────────────────────
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'

// ── Public Pages (created in Phase 4) ─────────────────────────
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import SignupPage from './pages/SignupPage/SignupPage.jsx'

// ── Protected Pages (created in Phase 8) ──────────────────────
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx'
import ExpensesPage from './pages/ExpensesPage/ExpensesPage.jsx'
import BudgetPage from './pages/BudgetPage/BudgetPage.jsx'

// ── 404 Page (created in Phase 8) ─────────────────────────────
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx'

function App() {
    return (
        <AuthProvider>
            <ExpenseProvider>
                <Routes>

                    {/* ── Public Routes ── */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* ── Protected Routes (must be logged in) ── */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/expenses"
                        element={
                            <ProtectedRoute>
                                <ExpensesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/budget"
                        element={
                            <ProtectedRoute>
                                <BudgetPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* ── Redirect /home to /dashboard ── */}
                    <Route path="/home" element={<Navigate to="/dashboard" replace />} />

                    {/* ── 404 catch-all ── */}
                    <Route path="*" element={<NotFoundPage />} />

                </Routes>
            </ExpenseProvider>
        </AuthProvider>
    )
}

export default App