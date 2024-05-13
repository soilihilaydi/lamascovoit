import request from 'supertest';
import app from '../../app';
import sequelize from '../../src/config/db.config.js';
import Utilisateur from '../../src/models/utilisateurModel.js';

const agent = request(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('Utilisateur Controller', () => {
  test('Inscription d\'un nouvel utilisateur', async () => {
    const email = generateRandomString(10) + '@example.com';
    const response = await agent
      .post('/api/utilisateurs/inscription')
      .send({
        email,
        password: 'password',
        nom: 'Test User',
        role: 'utilisateur'
      });

    expect(response.statusCode).toBe(201); // Mettre à jour l'attente à 201
    expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès.');
  });

  test('Erreur lors de l\'inscription avec un email déjà existant', async () => {
    const email = generateRandomString(10) + '@example.com';
    await agent
      .post('/api/utilisateurs/inscription')
      .send({
        email,
        password: 'password',
        nom: 'Test User',
        role: 'utilisateur'
      });

    const response = await agent
      .post('/api/utilisateurs/inscription')
      .send({
        email,
        password: 'password',
        nom: 'Test User',
        role: 'utilisateur'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Cet utilisateur existe déjà.');
  });
});