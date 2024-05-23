import 'dotenv/config';
import express from 'express';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import trajetRoutes from './src/routes/trajetRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes 
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/reservations', reservationRoutes);




export default app;

