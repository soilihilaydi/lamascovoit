import express from 'express';
import {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  updateTrajet,
  deleteTrajet
} from '../controllers/trajetController.js';

const router = express.Router();

// Publier un nouveau trajet
router.post('/', createTrajet);

// Lister les trajets disponibles
router.get('/', getAllTrajets);

// Détails d'un trajet
router.get('/:id', getTrajetById);

// Mettre à jour un trajet
router.put('/:id', updateTrajet);

// Supprimer un trajet
router.delete('/:id', deleteTrajet);

export default router;
