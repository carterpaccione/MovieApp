import express from 'express';
import { getRecommendations } from '../controllers/recommendController.js';

const router = express.Router();
router.post('/', getRecommendations);

export default router;