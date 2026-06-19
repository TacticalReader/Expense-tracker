import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
    getBudgets,
    upsertBudget,
} from '../controllers/budgetController.js'

const router = express.Router()

// Apply authMiddleware to ALL routes in this router.
// Every request to /api/budgets/* must have a valid JWT.
router.use(authMiddleware)

// GET  /api/budgets  → fetch all budgets for the user
router.get('/', getBudgets)

// POST /api/budgets  → create or update a budget (upsert)
router.post('/', upsertBudget)

export default router