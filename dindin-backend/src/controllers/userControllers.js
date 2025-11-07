import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

const JWT_SECRET = process.env.JWT_SECRET || "6831_3032_2025";

export const register = async (req,res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword){
        return res.status(400).json({ error: "Todos os campos são obrigatorios." });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser){
            return res.status(409).json({ error: "Esse email já é utilizado." });
        }

        if (password !== confirmPassword){
            return res.status(400).json({ error: "As senhas não coincidem." })
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: passwordHash,
            },
        });

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });

    } catch (error) {
        console.log("Erro no registro.", error);
        res.status(500).json({ error: "Erro interno ao tentar registrar usuario" });
    }
};

export const login = async (req,res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({ error: "Todos os campos são obrigatorios." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user){
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordCorrect){
            return res.status(401).json({ error: "Senha incorreta." });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "7d"}
        );

        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                monthlyIncome: user.monthlyIncome,
            },
        });

    } catch (error) {
        console.log("Erro no login", error);
        res.status(500).json({ error: "Erro interno ao fazer login."});
    }
};

export const setupIncome = async (req,res) => {
    const { monthlyIncome } = req.body;

    const userId = req.userId;

    if (monthlyIncome === undefined || monthlyIncome === null){
        return res.status(400).json({ error: "Renda mensal é obrigatoria." });
    }

    const incomeValue = parseFloat(monthlyIncome);
    if (isNaN (incomeValue) || incomeValue <= 0){
        return res.status(400).json({ error: "Renda inválida." });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                monthlyIncome: incomeValue,
            },
        });

        res.status(200).json({
            message: "Renda atualizada com sucesso.",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                monthlyIncome: updatedUser.monthlyIncome,
            },
        });

    } catch (error) {
        console.log("Erro ao atualizar renda: ", error);
        res.status(500).json({ error: "Erro interno."});
    }
};