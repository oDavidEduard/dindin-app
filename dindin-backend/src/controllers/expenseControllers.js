import { prisma } from "../index.js";

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