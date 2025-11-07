import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

const JWT_SECRET = process.env.JWT_SECRET || "6831_3032_2025";

export const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Token mal fornecido" });
    }
    
    const token = authHeader.split(" ")[1];

    try {
        const decodedPayload = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decodedPayload.userId },
        });

        if (!user){
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        req.userId = user.id;

        next();


    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"){
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }

        res.status(500).json({ error: "Erro interno." });
    }
};