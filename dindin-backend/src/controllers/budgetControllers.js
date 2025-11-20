import { prisma } from '../index.js';

export const setBudget = async(req,res) => {

    const userId = req.userId;
    const { categoryId, amountLimit, monthYear } = req.body;

    if(!categoryId || !amountLimit || !monthYear){
        return res.status(400).json({ message: "Todos os campos são obrigatorios." });
    }

    try {
        const existingBudget = await prisma.budget.findFirst({
            where:{
                userId: userId,
                categoryId: parseInt(categoryId),
                monthYear: monthYear,
            },
        });

        let budget;

        if(existingBudget){
            budget = await prisma.budget.update({
                where: { id: existingBudget.id },
                data: { amountLimit: parseFloat(amountLimit) },
            });
        } else{

            budget = await prisma.budget.create({
                data:{
                    userId: userId,
                    categoryId: parseInt(categoryId),
                    amountLimit: parseFloat(amountLimit),
                    monthYear: monthYear,
                },
            });
        }

        res.status(200).json(budget);

    } catch (error) {
        console.error("Erro ao salvar meta:", error);
        res.status(500).json({ error: "Erro interno ao salvar" });
    }
};

export const getBudgets = async (req,res) => {
    const userId = req.userId;
    const { monthYear } = req.query;

    if(!monthYear){
        return res.status(400).json({ error: "É necessario informar o mês e o ano" });
    }

    try {
        const budgets = await prisma.budget.findMany({
            where: {
                userId: userId,
                monthYear: monthYear,
            },
            include:{
                category: true,
            },
        });

        res.status(200).json(budgets);

    } catch (error) {
        console.error("Erro ao listar metas:", error);
        res.status(500).json({ error: "Erro interno ao listar metas" });
    }
};