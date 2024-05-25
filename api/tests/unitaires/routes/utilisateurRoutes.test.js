import request from 'supertest';
import express from 'express';
import router from '../../../src/routes/utilisateurRoutes.js';
import jwt from 'jsonwebtoken';

// Mock JWT verification middleware
jest.mock('../../../src/middlewares/authMiddleware.js', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 1; // Mocked user ID
    next();
  },
}));

// Mock the controller functions
jest.mock('../../../src/controllers/utilisateurController.js', () => ({
  register: (req, res) => res.status(201).json({ message: 'Utilisateur enregistré' }),
  login: (req, res) => res.status(200).json({ token: 'fake-jwt-token' }),
  getProfile: (req, res) => res.status(200).json({ id: req.userId, name: 'Test User' }),
  updateProfile: (req, res) => res.status(200).json({ message: 'Profil mis à jour' }),
  deleteProfile: (req, res) => res.status(200).json({ message: 'Profil supprimé avec succès' }),
}));

const app = express();
app.use(express.json());
app.use('/api/utilisateur', router);

describe('Utilisateur Routes', () => {
  test('POST /api/utilisateur/register devrait enregistrer un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateur/register')
      .send({ username: 'testuser', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur enregistré');
  });

  test('POST /api/utilisateur/login devrait connecter un utilisateur', async () => {
    const response = await request(app)
      .post('/api/utilisateur/login')
      .send({ username: 'testuser', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('fake-jwt-token');
  });

  test('GET /api/utilisateur/profile devrait obtenir le profil utilisateur', async () => {
    const response = await request(app)
      .get('/api/utilisateur/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Test User');
  });

  test('PUT /api/utilisateur/profile devrait mettre à jour le profil utilisateur', async () => {
    const response = await request(app)
      .put('/api/utilisateur/profile')
      .set('Authorization', 'Bearer fake-jwt-token')
      .send({ name: 'Updated User' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil mis à jour');
  });

  test('DELETE /api/utilisateur/profile devrait supprimer le profil utilisateur', async () => {
    const response = await request(app)
      .delete('/api/utilisateur/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil supprimé avec succès');
  });
});

