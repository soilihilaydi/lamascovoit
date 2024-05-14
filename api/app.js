import 'dotenv/config';
import express from "express";
import authRoutes from './src/routes/authRoutes.js';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import authMiddleware from './src/middlewares/authMiddleware.js';


const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/utilisateurs', utilisateurRoutes);

// Middleware d'authentification
app.use(authMiddleware);
export default app;