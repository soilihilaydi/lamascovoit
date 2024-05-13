import express from 'express';
import { getUserProfile, updateUserProfile, inscription } from '../controllers/utilisateurController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const utilisateurRouter = express.Router();

// Route pour obtenir le profil de l'utilisateur
utilisateurRouter.get('/profile', authMiddleware, getUserProfile);

// Route pour mettre à jour le profil de l'utilisateur
utilisateurRouter.put('/profile', authMiddleware, updateUserProfile);

// Route pour l'inscription d'un utilisateur
utilisateurRouter.post('/inscription', inscription);

export default utilisateurRouter;