import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// ── Load environment variables from server/.env ───────────────────
// MUST be called before any process.env.* access
dotenv.config()

// ── Phase 11 route imports ────────────────────────────────────────
import expenseRoutes from './routes/expenseRoutes.js'
import budgetRoutes from './routes/budgetRoutes.js'

// ── Global error handler (imported last, mounted last) ────────────
import errorMiddleware from './middleware/errorMiddleware.js'

// ── Create Express app ────────────────────────────────────────────
const app = express()

// ── CORS ──────────────────────────────────────────────────────────
// Allow requests only from the frontend origin defined in .env.
// Supports credentials (cookies/auth headers).
// Allows standard HTTP methods and the Authorization header
// which carries the Supabase JWT from the frontend.
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

// ── Parse incoming JSON request bodies ───────────────────────────
// Makes req.body available in all route handlers.
app.use(express.json())

// ── Health check route ────────────────────────────────────────────
// GET /health
// Use this to verify the server is running during development
// and to check Render deployment status in production.
// No auth required — intentionally public.
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Expense Tracker API is running',
        timestamp: new Date().toISOString(),
    })
})

// ── API Routes ────────────────────────────────────────────────────
// Uncomment these once Phase 11 is complete:
app.use('/api/expenses', expenseRoutes)
app.use('/api/budgets', budgetRoutes)

// ── 404 handler for unknown routes ───────────────────────────────
// Must come AFTER all valid routes but BEFORE errorMiddleware.
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' })
})

// ── Global error handler ──────────────────────────────────────────
// MUST be the very last app.use() call.
// Catches all errors thrown anywhere in the app.
app.use(errorMiddleware)

// ── Start server ──────────────────────────────────────────────────
// Port hardcoded as 5000 — not in .env per project requirements.
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`   Health check: http://localhost:${PORT}/health`)
    console.log(`   Allowed origin: ${process.env.CLIENT_URL}`)
})
