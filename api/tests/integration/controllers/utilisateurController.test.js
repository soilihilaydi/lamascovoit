import request from 'supertest';
import express from 'express';
import sequelize from '../../../src/config/db.config.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import userRoutes from '../../../src/routes/utilisateurRoutes.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

// Middleware de simulation de vérification JWT
const mockAuthMiddleware = (req, res, next) => {
  req.userId = 1; // ID utilisateur fictif
  next();
};

// Remplacer le middleware d'authentification par la simulation pour les tests
app.use((req, res, next) => {
  if (req.headers.authorization === 'Bearer fake-jwt-token') {
    return mockAuthMiddleware(req, res, next);
  }
  next();
});

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

afterEach(async () => {
  await Utilisateur.destroy({ where: {} });
});

describe('Tests d\'intégration pour le contrôleur Utilisateur', () => {
  test('POST /api/register devrait enregistrer un utilisateur', async () => {
    const newUser = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const response = await request(app)
      .post('/api/register')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur enregistré');
    expect(response.body.user).toHaveProperty('Email', newUser.Email);
  });

  test('POST /api/login devrait connecter un utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });

    const response = await request(app)
      .post('/api/login')
      .send({ Email: user.Email, MotDePasse: user.MotDePasse });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('GET /api/profile devrait récupérer le profil utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });

    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Email', user.Email);
    expect(response.body).toHaveProperty('Nom', user.Nom);
  });

  test('PUT /api/profile devrait mettre à jour le profil utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });

    const updatedData = {
      Nom: 'John Updated'
    };

    const response = await request(app)
      .put('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token')
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil mis à jour');
    expect(response.body.user).toHaveProperty('Nom', updatedData.Nom);
  });

  test('DELETE /api/profile devrait supprimer le profil utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });

    const response = await request(app)
      .delete('/api/profile')
      .set('Authorization', 'Bearer fake-jwt-token');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil supprimé avec succès');
  });
});
