import express from 'express';
import { Trajet } from '../models/trajetModel.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Assurez-vous que le chemin est correct

const router = express.Router();

// Créer un nouveau trajet (protégé par authentification)
router.post('/trajets', authMiddleware, async (req, res) => {
  try {
    const nouveauTrajet = await Trajet.create(req.body);
    res.status(201).json(nouveauTrajet);
  } catch (error) {
    console.error('Error creating trajet:', error);
    res.status(500).json({ error: 'Failed to create trajet' });
  }
});

// Obtenir tous les trajets
router.get('/trajets', async (req, res) => {
  try {
    const trajets = await Trajet.findAll();
    res.status(200).json(trajets);
  } catch (error) {
    console.error('Error fetching trajets:', error);
    res.status(500).json({ error: 'Failed to fetch trajets' });
  }
});

// Obtenir un trajet par ID
router.get('/trajets/:idTrajet', async (req, res) => {
  try {
    const trajet = await Trajet.findByPk(req.params.idTrajet);
    if (trajet) {
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ error: 'Trajet not found' });
    }
  } catch (error) {
    console.error('Error fetching trajet:', error);
    res.status(500).json({ error: 'Failed to fetch trajet' });
  }
});

// Mettre à jour un trajet par ID (protégé par authentification)
router.put('/trajets/:idTrajet', authMiddleware, async (req, res) => {
  try {
    const [updatedRows] = await Trajet.update(req.body, {
      where: { idTrajet: req.params.idTrajet }
    });
    if (updatedRows > 0) {
      const trajet = await Trajet.findByPk(req.params.idTrajet);
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ error: 'Trajet not found' });
    }
  } catch (error) {
    console.error('Error updating trajet:', error);
    res.status(500).json({ error: 'Failed to update trajet' });
  }
});

// Supprimer un trajet par ID (protégé par authentification)
router.delete('/trajets/:idTrajet', authMiddleware, async (req, res) => {
  try {
    const deletedRows = await Trajet.destroy({
      where: { idTrajet: req.params.idTrajet }
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Trajet not found' });
    }
  } catch (error) {
    console.error('Error deleting trajet:', error);
    res.status(500).json({ error: 'Failed to delete trajet' });
  }
});

export default router;
