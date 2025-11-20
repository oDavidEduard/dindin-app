import express from 'express';
import { getTips } from '../controllers/tipsControllers.js';

const router = express.Router();

router.get('/', getTips);

export default router;