import express from 'express';
import {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  updateTrajet,
  deleteTrajet
} from '../controllers/trajetController.js';

const router = express.Router();

router.post('/', createTrajet);
router.get('/', getAllTrajets);
router.get('/:id', getTrajetById);
router.put('/:id', updateTrajet);
router.delete('/:id', deleteTrajet);

export default router;

