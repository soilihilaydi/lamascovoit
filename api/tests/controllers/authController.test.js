import request from 'supertest';
import app from '../../app.js';
import Utilisateurs from '../../src/models/utilisateurModel.js';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthController', () => {
  beforeEach(async () => {
    // Réinitialiser les mocks de bcrypt avant chaque test
    bcrypt.genSalt.mockResolvedValue('mockSalt');
    bcrypt.hash.mockResolvedValue('mockedHash');
    bcrypt.compare.mockResolvedValue(true);

    // Créer la table Utilisateurs avant chaque test
    await Utilisateurs.sync({ force: true });
  });

  describe('POST /auth/register', () => {
    it('devrait enregistrer un nouvel utilisateur', async () => {
      const createSpy = jest.spyOn(Utilisateurs, 'create').mockResolvedValue({
        idUtilisateur: 1,
        nom: 'John Doe',
        email: 'john@example.com',
        password: 'mockedHash'
      });

      const consoleSpy = jest.spyOn(console, 'log');

      const response = await request(app)
        .post('/auth/register')
        .send({
          nom: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(createSpy).toHaveBeenCalledWith({
        nom: 'John Doe',
        email: 'john@example.com',
        password: 'mockedHash'
      });
      expect(consoleSpy).toHaveBeenCalledWith('Nouvel utilisateur créé');
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('idUtilisateur', 1);
      expect(response.body.user).toHaveProperty('nom', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });

    it('devrait renvoyer une erreur si l email est déjà enregistré', async () => {
      jest.spyOn(Utilisateurs, 'findOne').mockResolvedValue({
        idUtilisateur: 1,
        nom: 'Jane Doe',
        email: 'jane@example.com',
        password: 'mockedHash'
      });

      const consoleSpy = jest.spyOn(console, 'log');

      const response = await request(app)
        .post('/auth/register')
        .send({
          nom: 'John Doe',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(consoleSpy).toHaveBeenCalledWith('Utilisateur existant');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('devrait connecter un utilisateur', async () => {
      jest.spyOn(Utilisateurs, 'findOne').mockResolvedValue({
        idUtilisateur: 1,
        nom: 'John Doe',
        email: 'john@example.com',
        password: 'mockedHash'
      });

      const consoleSpy = jest.spyOn(console, 'log');

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(consoleSpy).toHaveBeenCalledWith('Utilisateur connecté');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('idUtilisateur', 1);
      expect(response.body.user).toHaveProperty('nom', 'John Doe');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
    });

    it('devrait renvoyer une erreur si l utilisateur n est pas trouvé', async () => {
      jest.spyOn(Utilisateurs, 'findOne').mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'log');

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(consoleSpy).toHaveBeenCalledWith('Utilisateur non trouvé');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('devrait renvoyer une erreur si le mot de passe est incorrect', async () => {
      jest.spyOn(Utilisateurs, 'findOne').mockResolvedValue({
        idUtilisateur: 1,
        nom: 'John Doe',
        email: 'john@example.com',
        password: 'mockedHash'
      });
      bcrypt.compare.mockResolvedValue(false);

      const consoleSpy = jest.spyOn(console, 'log');

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(consoleSpy).toHaveBeenCalledWith('Mot de passe incorrect');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
