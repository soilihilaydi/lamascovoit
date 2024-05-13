import { register, login } from '../../src/controllers/authController.js';
import Utilisateur from '../../src/models/utilisateurModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
jest.mock('../../src/models/utilisateurModel.js'); //  // Mocking du modèle utilisateur

describe('authController', () => {
  it('register devrait créer un nouvel utilisateur', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        nom: 'Test User'
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    Utilisateur.findOne.mockResolvedValue(null);
    Utilisateur.create.mockResolvedValue({ id: 1, ...req.body });

    await register(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userId: 1 }));
  });

  it('login devrait authentifier un utilisateur', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    Utilisateur.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    });

    await login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });
});