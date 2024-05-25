import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import { register, login, getProfile, updateProfile, deleteProfile } from '../../../src/controllers/utilisateurController.js';
import Utilisateur from '../../../src/models/utilisateurModel.js'; // Correction ici

// Mock JWT verification middleware
jest.mock('../../../src/middlewares/authMiddleware.js', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 1; // Mocked user ID
    next();
  },
}));

// Mock Utilisateur model
jest.mock('../../../src/models/utilisateurModel.js', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post('/api/register', register);
app.post('/api/login', login);
app.get('/api/profile', (req, res, next) => {
  req.userId = 1; // Mocked user ID
  next();
}, getProfile);
app.put('/api/profile', (req, res, next) => {
  req.userId = 1; // Mocked user ID
  next();
}, updateProfile);
app.delete('/api/profile', (req, res, next) => {
  req.userId = 1; // Mocked user ID
  next();
}, deleteProfile);

describe('Utilisateur Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/register devrait enregistrer un utilisateur', async () => {
    Utilisateur.create.mockResolvedValue({ idUtilisateur: 1, Email: 'test@example.com' });
    const response = await request(app)
      .post('/api/register')
      .send({ Email: 'test@example.com', MotDePasse: 'password123', Nom: 'John Doe' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur enregistré');
  });

  test('POST /api/login doit connecter un utilisateur', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    Utilisateur.findOne.mockResolvedValue({ idUtilisateur: 1, Email: 'test@example.com', MotDePasse: hashedPassword });
    const response = await request(app)
      .post('/api/login')
      .send({ Email: 'test@example.com', MotDePasse: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); // Vérifie que le token est défini
  });

  test('GET /api/profile devrait obtenir le profil utilisateur', async () => {
    Utilisateur.findByPk.mockResolvedValue({ idUtilisateur: 1, Nom: 'Test User' });
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body.idUtilisateur).toBe(1);
    expect(response.body.Nom).toBe('Test User'); // Assurez-vous que le champ Nom est correct
  });

  test('PUT /api/profile doit mettre à jour le profil utilisateur', async () => {
    const mockUser = {
      idUtilisateur: 1,
      Nom: 'Test User',
      update: jest.fn().mockResolvedValue({ idUtilisateur: 1, Nom: 'Updated User' })
    };
    Utilisateur.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token')
      .send({ Nom: 'Updated User' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil mis à jour');
    expect(mockUser.update).toHaveBeenCalledWith({ Nom: 'Updated User' });
  });

  test('DELETE /api/profile devrait supprimer le profil utilisateur', async () => {
    const mockUser = {
      idUtilisateur: 1,
      destroy: jest.fn().mockResolvedValue()
    };
    Utilisateur.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .delete('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil supprimé avec succès');
    expect(mockUser.destroy).toHaveBeenCalled();
  });
});

