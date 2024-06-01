import request from 'supertest';
import express from 'express';
import sequelize from '../../../src/config/db.config.js';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Désactiver les contraintes de clé étrangère temporairement
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
});

afterEach(async () => {
  await Utilisateur.destroy({ where: {} });
});

app.post('/utilisateurs', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.create(req.body);
    res.status(201).json(utilisateur);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Un utilisateur avec cette adresse email existe déjà' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

describe('Tests d\'intégration pour les routes Utilisateur', () => {
  test('POST /utilisateurs devrait créer un nouvel utilisateur', async () => {
    const newUser = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'John Doe'
    };
    const response = await request(app)
      .post('/utilisateurs')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('Email', newUser.Email);
    expect(response.body).toHaveProperty('MotDePasse', newUser.MotDePasse);
    expect(response.body).toHaveProperty('Nom', newUser.Nom);
  });

  test('POST /utilisateurs ne devrait pas créer un utilisateur avec un email en double', async () => {
    const duplicateUser = {
      Email: 'test@example.com',
      MotDePasse: 'password123',
      Nom: 'Jane Doe'
    };
    await Utilisateur.create(duplicateUser); // Créer un utilisateur initial

    const response = await request(app)
      .post('/utilisateurs')
      .send(duplicateUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Un utilisateur avec cette adresse email existe déjà');
  });
});