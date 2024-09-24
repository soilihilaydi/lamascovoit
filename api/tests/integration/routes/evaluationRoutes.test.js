import request from 'supertest';
import app from '../../../app.js'; // L'application Express
import models from '../../../src/models/index.js'; // Les modèles Sequelize
import sequelize from '../../../src/config/db.config.js'; // Configuration de la base de données
import jwt from 'jsonwebtoken';

const { Evaluation, Utilisateur, Trajet } = models;

let token;
let adminToken;
let utilisateur;
let trajet;
let evaluation;

beforeAll(async () => {
  // Authentification de la base de données et synchronisation
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  // Création d'un utilisateur pour les tests
  utilisateur = await Utilisateur.create({
    Nom: 'Test User',
    Email: 'testuser@example.com',
    MotDePasse: 'hashedpassword',
    isAdmin: false,
  });

  // Création d'un administrateur pour les tests
  const admin = await Utilisateur.create({
    Nom: 'Admin User',
    Email: 'admin@example.com',
    MotDePasse: 'hashedpassword',
    isAdmin: true,
  });

  // Création d'un trajet pour les tests
  trajet = await Trajet.create({
    Depart: 'Lamastre',
    Arrivee: 'Valence',
    DateHeure: '2024-09-14T10:00:00Z',
    PlacesDisponibles: 3,
    Prix: 5.50,
  });

  // Génération des tokens JWT
  token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: admin.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Ferme la connexion après les tests
  await sequelize.close();
});

describe('Tests d\'intégration pour les routes Evaluation', () => {
  
  // Test de création d'une évaluation
  test('Création d\'une evaluation', async () => {
    const response = await request(app)
      .post('/api/evaluations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Note: 5,
        Commentaire: 'Tres bon trajet !',
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
      });

    expect(response.status).toBe(201);
    expect(response.body.evaluation).toHaveProperty('idEvaluation');
    evaluation = response.body.evaluation; // Stocke l'évaluation pour les tests suivants
  });

  // Test de récupération de toutes les évaluations
  test('Récupération de toutes les evaluations', async () => {
    const response = await request(app)
      .get('/api/evaluations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test de récupération d'une évaluation par ID
  test('Récupération d\'une evaluation par ID', async () => {
    const response = await request(app)
      .get(`/api/evaluations/${evaluation.idEvaluation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('idEvaluation', evaluation.idEvaluation);
  });

  // Test de mise à jour d'une évaluation
  test('Mise à jour d\'une evaluation', async () => {
    const response = await request(app)
      .put(`/api/evaluations/${evaluation.idEvaluation}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Note: 4, // Modification de la note
        Commentaire: 'Bon trajet',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Evaluation mise a jour'); // Correction sans accents
  });

  // Test de suppression d'une évaluation
  test('Suppression d\'une evaluation', async () => {
    const response = await request(app)
      .delete(`/api/evaluations/${evaluation.idEvaluation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Evaluation supprimee'); // Correction sans accents
  });

  // Test de suppression d'une évaluation par un administrateur
  test('Suppression d\'une evaluation (admin uniquement)', async () => {
    // Re-crée une évaluation pour ce test
    const newEvaluation = await Evaluation.create({
      Note: 3,
      Commentaire: 'Correct',
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
    });

    const response = await request(app)
      .delete(`/api/evaluations/${newEvaluation.idEvaluation}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Evaluation supprimee'); // Correction sans accents
  });
});



