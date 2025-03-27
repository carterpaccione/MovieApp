import express from 'express';
import recommendRoutes from './recommendRoutes.js';
import imdbRoutes from './imdbRoutes.js';

const router = express.Router();

router.use('/movies', imdbRoutes);
router.use('/recommend', recommendRoutes);

export default router;
