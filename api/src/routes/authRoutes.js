import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);  // Inscription des utilisateurs
router.post('/login', login);        // Connexion des utilisateurs

export default router;
