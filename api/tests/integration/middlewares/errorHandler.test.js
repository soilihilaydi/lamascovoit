import request from 'supertest';
import express from 'express';
import { errorHandler, notFound } from '../../../src/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

app.get('/error', (req, res, next) => {
  const error = new Error('Test Error');
  error.status = 400;
  next(error);
});

app.get('/error500', (req, res, next) => {
  const error = new Error('Erreur de test sans statut');
  next(error);
});

app.use(notFound);
app.use(errorHandler);

describe('Error Handler Middleware', () => {
  test('devrait gérer les erreurs et répondre avec le statut et le message', async () => {
    const response = await request(app).get('/error');
    

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Test Error', stack: expect.any(String) });
  });

  test('devrait gérer les erreurs avec le statut 500 par défaut', async () => {
    const response = await request(app).get('/error500');
    

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Erreur de test sans statut', stack: expect.any(String) });
  });
});

