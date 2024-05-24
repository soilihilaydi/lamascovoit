import request from 'supertest';
import express from 'express';
import { notFound, errorHandler } from '../../../src/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

app.get('/error', (req, res) => {
  throw new Error('Test Error');
});

// Middleware pour gérer les routes non trouvées
app.use(notFound);

// Middleware pour gérer les erreurs
app.use(errorHandler);

describe('Error Handling Middleware', () => {
  test('devrait renvoyer 404 pour les itinéraires inexistants', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Not Found');
  });

  test('devrait renvoyer 500 pour les erreurs serveur', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Test Error');
  });
});
