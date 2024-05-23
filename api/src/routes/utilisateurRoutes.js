// routeutilisateur.js
import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/utilisateurController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour l'inscription d'un utilisateur
router.post('/register', register);

// Route pour la connexion d'un utilisateur
router.post('/login', login);

// Route pour récupérer le profil de l'utilisateur
router.get('/profile', verifyToken, getProfile);

// Route pour mettre à jour le profil de l'utilisateur
router.put('/profile', verifyToken, updateProfile);

export default router;


