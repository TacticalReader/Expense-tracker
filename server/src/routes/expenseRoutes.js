import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
    getAllExpenses,
    createExpense,
    deleteExpense,
} from '../controllers/expenseController.js'

const router = express.Router()

// Apply authMiddleware to ALL routes in this router.
// Every request to /api/expenses/* must have a valid JWT.
router.use(authMiddleware)

// GET    /api/expenses      → fetch all expenses for the user
router.get('/', getAllExpenses)

// POST   /api/expenses      → create a new expense
router.post('/', createExpense)

// DELETE /api/expenses/:id  → delete one expense by ID
router.delete('/:id', deleteExpense)

export default router