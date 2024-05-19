// app.js

import express from 'express';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';

import { authMiddleware } from './src/middlewares/authMiddleware.js';


const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware d'authentification
app.use(authMiddleware);

// Routes des utilisateurs
app.use('/api', utilisateurRoutes);

// Routes des trajets


export default app;

