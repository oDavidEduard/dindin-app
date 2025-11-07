import express from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../src/routes/authRoutes.js";
import expenseRoutes from "../src/routes/expenseRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const prisma = new PrismaClient();

app.use("/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});