import request from 'supertest';
import express from 'express';
import sequelize from '../../../src/config/db.config.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import utilisateurRoutes from '../../../src/routes/utilisateurRoutes.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();
jest.setTimeout(10000);

const app = express();
app.use(express.json());
app.use('/api/utilisateurs', utilisateurRoutes);

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

afterEach(async () => {
  await Utilisateur.destroy({ where: {} });
});

describe('Tests d\'intégration pour les routes Utilisateur', () => {
  test('POST /api/utilisateurs/register devrait créer un nouvel utilisateur', async () => {
    const newUser = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const response = await request(app)
      .post('/api/utilisateurs/register')
      .send(newUser);
    console.log('Test register - Response status:', response.status);
    console.log('Test register - Response body:', response.body);
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('Email', newUser.Email);
    expect(response.body.user).toHaveProperty('MotDePasse'); // Le mot de passe est hashé
    expect(response.body.user).toHaveProperty('Nom', newUser.Nom);
  });

  test('POST /api/utilisateurs/register ne devrait pas créer un utilisateur avec un email en double', async () => {
    const duplicateUser = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'Jane Doe'
    };
    await Utilisateur.create(duplicateUser);

    const response = await request(app)
      .post('/api/utilisateurs/register')
      .send(duplicateUser);
    console.log('Test register duplicate - Response status:', response.status);
    console.log('Test register duplicate - Response body:', response.body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Un utilisateur avec cette adresse email existe déjà');
  });

  test('POST /api/utilisateurs/login devrait connecter un utilisateur existant', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });

    const response = await request(app)
      .post('/api/utilisateurs/login')
      .send({ Email: user.Email, MotDePasse: user.MotDePasse });
    console.log('Test login - Response status:', response.status);
    console.log('Test login - Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('GET /api/utilisateurs/profile devrait récupérer le profil de l\'utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const createdUser = await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });
    const token = jwt.sign({ id: createdUser.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`);
    console.log('Test get profile - Response status:', response.status);
    console.log('Test get profile - Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Email', user.Email);
    expect(response.body).toHaveProperty('Nom', user.Nom);
  });

  test('PUT /api/utilisateurs/profile devrait mettre à jour le profil de l\'utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const createdUser = await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });
    const token = jwt.sign({ id: createdUser.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const updatedData = {
      Nom: 'John Updated'
    };

    const response = await request(app)
      .put('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
    console.log('Test update profile - Response status:', response.status);
    console.log('Test update profile - Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('Nom', updatedData.Nom);
  });

  test('DELETE /api/utilisateurs/profile devrait supprimer le profil utilisateur', async () => {
    const user = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const createdUser = await Utilisateur.create({ ...user, MotDePasse: await bcrypt.hash(user.MotDePasse, 10) });
    const token = jwt.sign({ id: createdUser.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .delete('/api/utilisateurs/profile')
      .set('Authorization', `Bearer ${token}`);
    console.log('Test delete profile - Response status:', response.status);
    console.log('Test delete profile - Response body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profil supprimé avec succès');
  });
});
