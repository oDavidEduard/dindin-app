import { prisma } from "../index.js";
import axios from 'axios';

//Criar despesa
export const createExpense = async (req,res) => {
    const { name, amount, description, date, isEssential, categoryId } = req.body;
    const userId = req.userId;

    if(!name || !amount || !date || !categoryId){
        return res.status(400).json({ error: "Preencha os campos obrigatórios." })
    }

    try {
        const newExpense = await prisma.expense.create({
            data: {
                name: name,
                amount: parseFloat(amount),
                description: description,
                date: new Date(date),
                isEssential: Boolean(isEssential),
                userId: userId,
                categoryId: parseInt(categoryId),
            },
        });

        res.status(201).json(newExpense);

    } catch (error) {
        console.error("Erro ao criar despesa.", error);
        res.status(500).json({ error: "Erro interno." });
    }
};

//Lista das despesas
export const getExpenses = async(req,res) => {
    const userId = req.userId;

    const { categoryId } = req.query;

    try {

        let whereClause ={
            userId: userId,
        };

        if(categoryId){
            whereClause.categoryId = parseInt(categoryId);
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            orderBy: {
                date: "desc",
            },
            include: {
                category: true,
            }
        });
        res.status(200).json(expenses);

    } catch (error) {
        console.error("Erro ao listar as despesas", error);
        res.status(500).json({ error: "Erro interno." });
    }
}

//Atualizar despesa
export const updateExpense = async(req,res) => {
    const { id } = req.params;
    const { name, amount, description, date, isEssential, categoryId } = req.body;
    const userId = req.userId

    try {
        const expense = await prisma.expense.findFirst({
            where: {
                id: parseInt(id),
                userId: userId,
            }
        });

        if (!expense){
            return res.status(404).json({ error: "Despesa não encontrada" });
        }

        const updatedExpense = await prisma.expense.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: name || undefined,
                amount: amount ? parseFloat(amount) : undefined,
                description: description || undefined,
                date: date ? new Date(date) : undefined,
                isEssential: isEssential !== undefined ? Boolean(isEssential) : undefined,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
            },
        });
        res.status(200).json({updateExpense});

    } catch (error) {
        console.error("Erro ao atualizar despesa", error);
        res.status(500).json({ error: "Erro interno." });
    }
};

//deletar despesa
export const deleteExpense = async(req,res) => {

    const { id } = req.params;
    const { userId } = req.userId;

    try {
        
        const deleteResult = await prisma.expense.deleteMany({
            where: {
                id: parseInt(id),
                userId: userId,
            }
        });

        if (deleteResult === 0) {
            return res.status(404).json({ error: "Despesa não encontrada" });
        }

        res.status(204).send();

    } catch (error) {
        console.error("Erro ao deletar despesa: ", error);
        res.status(500).json({ error: "Erro interno." });
    }
};

export const getPrediction = async(req,res) =>{
    const userId = req.userId;
    const { categoryId } = req.query;

    if(!categoryId){
        return res.status(400);json({ error: "Categoria é obrigatoria" });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year,month, 1);
    const lastDay = new Date(year,month + 1, 0);

    try {
        const expenses = await prisma.expense.findMany({
            where:{
                userId: userId,
                categoryId: parseInt(categoryId),
                date:{ gte: firstDay, lte: lastDay },
            },
            orderBy: { date: 'asc' }
        });

        const expenseList = expenses.map(e => ({
            date: e.date.toISOString().split('T')[0],
            amount: parseFloat(e.amount)
        }));

        const totalSpentNow = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

        try {
            const pythonUrl = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

            const pythonResponse = await axios.post(`${pythonUrl}/predict`, {
                expenses: expenseList,
                target_month: month + 1,
                target_year: year
            });

            const { prediction, trend } = pythonResponse.data;

            let statusMsg = "Estável";
            if (trend === "increasing") statusMsg = "Tendência de Alta";

            return res.json({
                categoryId: parseInt(categoryId),
                totalSpentNow: totalSpentNow,
                prediction: prediction,
                status: statusMsg
            });

        } catch (aiError) {
            console.error("IA Offline ou Erro:", aiError.message);
            return res.json({
                categoryId: parseInt(categoryId),
                totalSpentNow: totalSpentNow,
                prediction: totalSpentNow,
                status: "Cálculo indisponivel"
            });
        }

    } catch (error) {
        console.error("Erro na predição: ", error);
        res.status(500).json({ error: "Erro ao calcular predição" });
    }
};