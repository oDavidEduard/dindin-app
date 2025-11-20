import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { setBudget, getBudgets } from '../controllers/budgetControllers.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', setBudget);

router.get('/', getBudgets);

export default router;