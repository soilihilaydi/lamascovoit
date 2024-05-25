import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../../src/middlewares/authMiddleware.js';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'process.env.JWT_SECRET';

// Route protégée pour le test
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé', userId: req.userId });
});

describe('Auth Middleware', () => {
  let token;

  beforeAll(() => {
    // Créer un token valide pour les tests
    token = jwt.sign({ id: 'testUserId' }, JWT_SECRET, { expiresIn: '1h' });
  });

  test('devrait renvoyer 401 si aucun token n\'est fourni', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Accès refusé : aucun token fourni' });
  });

  test('devrait renvoyer 400 si le token est invalide', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidToken');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Token invalide' });
  });

  test('devrait autoriser l\'accès avec un token valide', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Accès autorisé', userId: 'testUserId' });
  });
});


