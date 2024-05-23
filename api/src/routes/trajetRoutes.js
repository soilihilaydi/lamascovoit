import express from 'express';
import { createTrajet, getTrajets, getTrajet, updateTrajet, deleteTrajet } from '../controllers/trajetController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTrajet);
router.get('/', getTrajets);
router.get('/:id', getTrajet);
router.put('/:id', verifyToken, updateTrajet);
router.delete('/:id', verifyToken, deleteTrajet);

export default router;


