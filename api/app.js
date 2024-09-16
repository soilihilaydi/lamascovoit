import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import utilisateurRoutes from './src/routes/utilisateurRoutes.js';
import trajetRoutes from './src/routes/trajetRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';
import evaluationRoutes from './src/routes/evaluationRoutes.js';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import xssProtection from './src/middlewares/xssProtection.js';



const app = express();

// Configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Lamastre-covoit',
      version: '1.0.0',
      description: 'API pour le service de covoiturage local de Lamastre',
    },
  },
  apis: [
    './src/routes/*.js',
    './docs/swaggerSchemas.js',
    './src/docs/*.js',
    './src/models/*.js'  
  ],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


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




