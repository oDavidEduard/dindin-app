import express from "express";
import { register } from "../controllers/userControllers.js";
import { login } from "../controllers/userControllers.js";
import { setupIncome } from "../controllers/userControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/setup", authMiddleware, setupIncome);

export default router;