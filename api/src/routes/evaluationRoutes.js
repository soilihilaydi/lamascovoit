// src/routes/evaluationRoutes.js
import express from 'express';
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../controllers/evaluationController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/api/evaluations', verifyToken, createEvaluation);
router.get('/api/evaluations', verifyToken, getEvaluations);
router.get('/api/evaluations/:id', verifyToken, getEvaluationById);
router.put('/api/evaluations/:id', verifyToken, updateEvaluation);
router.delete('/api/evaluations/:id', verifyToken, deleteEvaluation);

export default router;
