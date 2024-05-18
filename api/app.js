import express from 'express';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Utiliser les routes 
app.use('/api', utilisateurRoutes);

export default app;
