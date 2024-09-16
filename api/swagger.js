import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Lamastre-covoit',
      version: '1.0.0',
      description: 'API pour le service de covoiturage local de Lamastre',
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // chemins vers vos fichiers de routes et modèles
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };