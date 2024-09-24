import request from 'supertest';
import app from '../../../app.js'; // L'application Express
import models from '../../../src/models/index.js'; // Les modèles Sequelize
import sequelize from '../../../src/config/db.config.js'; // Configuration de la base de données
import jwt from 'jsonwebtoken';

const { Trajet, Utilisateur } = models;

let token;
let utilisateur;
let trajet;

beforeAll(async () => {
  // Authentification de la base de données
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Création d'un utilisateur pour les tests et génération du jeton JWT
  utilisateur = await Utilisateur.create({
    Nom: 'Test User',
    Email: 'testuser@example.com',
    MotDePasse: 'hashedpassword', // Assurez-vous que ce mot de passe est haché
  });

  token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Ferme la connexion après les tests
  await sequelize.close();
});

describe('Tests d\'intégration du contrôleur Trajet', () => {

  // Test de création de trajet
  test('Création d\'un trajet', async () => {
    const response = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Depart: 'Lamastre', // Nom sans accent
        Arrivee: 'Valence', // Nom sans accent
        DateHeure: '2024-09-14T10:00:00Z',
        PlacesDisponibles: 3,
        Prix: 5.50
      });

    expect(response.status).toBe(201);
    expect(response.body.trajet).toHaveProperty('idTrajet');
    trajet = response.body.trajet; // Stocke le trajet pour les tests suivants
  });

  // Test de récupération de tous les trajets
  test('Récupération de tous les trajets', async () => {
    const response = await request(app)
      .get('/api/trajets')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test de récupération d'un trajet par ID
  test('Récupération d\'un trajet par ID', async () => {
    const response = await request(app)
      .get(`/api/trajets/${trajet.idTrajet}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('idTrajet', trajet.idTrajet);
  });

  // Test de mise à jour d'un trajet
  test('Mise à jour d\'un trajet', async () => {
    const response = await request(app)
      .put(`/api/trajets/${trajet.idTrajet}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Depart: 'Lamastre',
        Arrivee: 'Lyon', // Modification du lieu d'arrivée
        DateHeure: '2024-09-14T12:00:00Z',
        PlacesDisponibles: 4,
        Prix: 6.50
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet mis à jour');
  });

  // Test de suppression d'un trajet
  test('Suppression d\'un trajet', async () => {
    const response = await request(app)
      .delete(`/api/trajets/${trajet.idTrajet}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet supprimé');
  });
});

