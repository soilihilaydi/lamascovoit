import 'dotenv/config';
import express from 'express';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import trajetRoutes from './src/routes/trajetRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';
import evaluationRoutes from './src/routes/evaluationRoutes.js';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import xssProtection from './src/middlewares/xssProtection.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(xssProtection); // Protection XSS

// Routes 
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Middleware pour gérer les routes non trouvées
app.use(notFound);

// Middleware pour gérer les erreurs
app.use(errorHandler);

export default app;




