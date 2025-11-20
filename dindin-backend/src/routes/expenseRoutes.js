import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createExpense, getExpenses, updateExpense, deleteExpense, getPrediction } from "../controllers/expenseControllers.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getExpenses);

router.get("/prediction", getPrediction);

router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);



export default router;
