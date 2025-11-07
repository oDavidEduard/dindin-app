import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseControllers.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
