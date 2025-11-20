import express from "express";
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import authRoutes from "../src/routes/authRoutes.js";
import expenseRoutes from "../src/routes/expenseRoutes.js";
import budgetRoutes from "../src/routes/budgetRoutes.js";
import tipsRoutes from "../src/routes/tipsRoutes.js";

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

export const prisma = new PrismaClient();

app.use("/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/tips", tipsRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});