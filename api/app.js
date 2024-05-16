import 'dotenv/config';
import express from "express";
import { Router } from 'express';
import authRoutes from './src/routes/authRoutes.js';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import trajetRoutes from './src/routes/trajetRoutes.js';
import authMiddleware from './src/middlewares/authMiddleware.js';

const app = express();
const protectedRoutes = Router();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/trajets', trajetRoutes); // Route non protégée pour POST /trajets

// Routes protégées
protectedRoutes.use(authMiddleware);
protectedRoutes.use('/trajets', trajetRoutes); // Routes protégées pour GET, PUT, DELETE /trajets

app.use('/api', protectedRoutes);

export default app;