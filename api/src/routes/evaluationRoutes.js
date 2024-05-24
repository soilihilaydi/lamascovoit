// src/routes/evaluationRoutes.js
import express from 'express';
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../controllers/evaluationController.js';

const router = express.Router();

router.post('/api/evaluations', createEvaluation);
router.get('/api/evaluations', getEvaluations);
router.get('/api/evaluations/:id', getEvaluationById);
router.put('/api/evaluations/:id', updateEvaluation);
router.delete('/api/evaluations/:id', deleteEvaluation);

export default router;

