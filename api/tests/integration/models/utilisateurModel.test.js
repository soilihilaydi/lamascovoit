import request from 'supertest';
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import Utilisateur from '../../../src/models/utilisateurModel.js';
import dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

// Configuration de l'application Express
const app = express();
app.use(express.json()); // Utilisation du middleware intégré d'Express pour analyser les requêtes JSON

// Initialisation de Sequelize avec les paramètres MySQL
const sequelizeInstance = new Sequelize(
  process.env.TEST_DB_NAME,
  process.env.TEST_DB_USER,
  process.env.TEST_DB_PASS,
  {
    host: process.env.TEST_DB_HOST,
    dialect: process.env.TEST_DB_DIALECT,
  }
);
const UtilisateurModel = Utilisateur(sequelizeInstance); // Utilisation correcte du modèle

// Synchronisation de la base de données avant tous les tests
beforeAll(async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connection has been established successfully.');

    // Désactiver les contraintes de clé étrangère temporairement
    await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelizeInstance.sync({ force: true });
    await sequelizeInstance.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

// Route pour créer un utilisateur
app.post('/utilisateurs', async (req, res) => {
  try {
    const utilisateur = await UtilisateurModel.create(req.body);
    res.status(201).json(utilisateur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
  try {
    const utilisateurs = await UtilisateurModel.findAll();
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir un utilisateur par ID
app.get('/utilisateurs/:id', async (req, res) => {
  try {
    const utilisateur = await UtilisateurModel.findByPk(req.params.id);
    if (utilisateur) {
      res.status(200).json(utilisateur);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour mettre à jour un utilisateur
app.put('/utilisateurs/:id', async (req, res) => {
  try {
    const [updated] = await UtilisateurModel.update(req.body, {
      where: { idUtilisateur: req.params.id }
    });
    if (updated) {
      const updatedUtilisateur = await UtilisateurModel.findByPk(req.params.id);
      res.status(200).json(updatedUtilisateur);
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour supprimer un utilisateur
app.delete('/utilisateurs/:id', async (req, res) => {
  try {
    const deleted = await UtilisateurModel.destroy({
      where: { idUtilisateur: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tests d'intégration
describe('Tests d\'intégration pour les routes Utilisateur', () => {
  test('POST /utilisateurs devrait créer un nouvel utilisateur', async () => {
    const response = await request(app)
      .post('/utilisateurs')
      .send({
        Email: 'test@example.com',
        MotDePasse: 'password123',
        Nom: 'John Doe',
        Adresse: '123 Test St',
        NuméroDeTéléphone: '1234567890',
        PhotoUrl: 'http://example.com/photo.jpg',
        Rôle: 'user'
      });
    expect(response.status).toBe(201);
    expect(response.body.Email).toBe('test@example.com');
  });

  test('GET /utilisateurs devrait obtenir tous les utilisateurs', async () => {
    const response = await request(app).get('/utilisateurs');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /utilisateurs/:id devrait obtenir un utilisateur par ID', async () => {
    const utilisateur = await UtilisateurModel.create({
      Email: 'test2@example.com',
      MotDePasse: 'password123',
      Nom: 'Jane Doe',
      Adresse: '456 Test St',
      NuméroDeTéléphone: '0987654321',
      PhotoUrl: 'http://example.com/photo2.jpg',
      Rôle: 'user'
    });

    const response = await request(app).get(`/utilisateurs/${utilisateur.idUtilisateur}`);
    expect(response.status).toBe(200);
    expect(response.body.Email).toBe('test2@example.com');
  });

  test('PUT /utilisateurs/:id devrait mettre à jour un utilisateur', async () => {
    const utilisateur = await UtilisateurModel.create({
      Email: 'test3@example.com',
      MotDePasse: 'password123',
      Nom: 'Jim Doe',
      Adresse: '789 Test St',
      NuméroDeTéléphone: '1122334455',
      PhotoUrl: 'http://example.com/photo3.jpg',
      Rôle: 'user'
    });

    const response = await request(app)
      .put(`/utilisateurs/${utilisateur.idUtilisateur}`)
      .send({
        Nom: 'Jim Updated'
      });

    expect(response.status).toBe(200);
    expect(response.body.Nom).toBe('Jim Updated');
  });

  test('DELETE /utilisateurs/:id devrait supprimer un utilisateur', async () => {
    const utilisateur = await UtilisateurModel.create({
      Email: 'test4@example.com',
      MotDePasse: 'password123',
      Nom: 'Jake Doe',
      Adresse: '101 Test St',
      NuméroDeTéléphone: '6677889900',
      PhotoUrl: 'http://example.com/photo4.jpg',
      Rôle: 'user'
    });

    const response = await request(app).delete(`/utilisateurs/${utilisateur.idUtilisateur}`);
    expect(response.status).toBe(204);
  });
});
