import request from 'supertest';
import { Sequelize } from 'sequelize';
import app from '../../../app.js';
import { Utilisateur } from '../../../src/models/utilisateurModel.js';
import dotenv from 'dotenv';

// Mock du middleware d'authentification
jest.mock('../../../src/middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    // Autoriser toutes les requêtes sans vérifier l'authentification
    next();
  })
}));

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.TEST_DB_HOST,
  username: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASS,
  database: process.env.TEST_DB_NAME,
  logging: false,
});

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Utilisateur Controller', () => {
  it('devrait créer un nouvel utilisateur', async () => {
    const newUser = {
      Email: process.env.TEST_USER_EMAIL,
      MotDePasse: process.env.TEST_USER_PASSWORD,
      Nom: 'Nom Test',
      Adresse: 'Adresse Test',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    };

    const response = await request(app)
      .post('/api/utilisateurs')
      .send(newUser)
      .expect(201);

    expect(response.body.Email).toBe(newUser.Email);
  });

  it('devrait récupérer tous les utilisateurs', async () => {
    const response = await request(app)
      .get('/api/utilisateurs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('devrait récupérer un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'fetch@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Fetch',
      Adresse: 'Adresse Fetch',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    const response = await request(app)
      .get(`/api/utilisateurs/${user.idUtilisateur}`)
      .expect(200);

    expect(response.body.Email).toBe(user.Email);
  });

  it('devrait mettre à jour un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'update@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Update',
      Adresse: 'Adresse Update',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    const updatedData = {
      Nom: 'Nom Updated'
    };

    const response = await request(app)
      .put(`/api/utilisateurs/${user.idUtilisateur}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.Nom).toBe(updatedData.Nom);
  });

  it('devrait supprimer un utilisateur par ID', async () => {
    const user = await Utilisateur.create({
      Email: 'delete@example.com',
      MotDePasse: 'motdepasse123',
      Nom: 'Nom Delete',
      Adresse: 'Adresse Delete',
      NuméroDeTéléphone: '0123456789',
      PhotoUrl: 'https://example.com/photo.jpg',
      Rôle: 'conducteur'
    });

    await request(app)
      .delete(`/api/utilisateurs/${user.idUtilisateur}`)
      .expect(204);

    const fetchedUser = await Utilisateur.findByPk(user.idUtilisateur);
    expect(fetchedUser).toBeNull();
  });
});


