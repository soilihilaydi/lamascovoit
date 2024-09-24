import request from 'supertest';
import app from '../../../app.js'; // L'application Express
import models from '../../../src/models/index.js'; // Les modèles Sequelize
import sequelize from '../../../src/config/db.config.js'; // Configuration de la base de données
import jwt from 'jsonwebtoken';

const { Reservation, Trajet, Utilisateur } = models;

let token;
let adminToken;
let utilisateur;
let trajet;
let reservation;

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
    Prix: 5.50
  });

  // Génération des tokens JWT
  token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: admin.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Ferme la connexion après les tests
  await sequelize.close();
});

describe('Tests d\'intégration pour les routes Reservation', () => {
  
  // Test de création d'une réservation
  test('Création d\'une reservation', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
        DateReservation: '2024-09-10T10:00:00Z'
      });

    expect(response.status).toBe(201);
    expect(response.body.reservation).toHaveProperty('idReservation');
    reservation = response.body.reservation; // Stocke la réservation pour les tests suivants
  });

  // Test de récupération de toutes les réservations
  test('Récupération de toutes les reservations', async () => {
    const response = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test de récupération d'une réservation par ID
  test('Récupération d\'une reservation par ID', async () => {
    const response = await request(app)
      .get(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('idReservation', reservation.idReservation);
  });

  // Test de mise à jour d'une réservation
  test('Mise à jour d\'une reservation', async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
        DateReservation: '2024-09-15T10:00:00Z' // Modification de la date de réservation
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation mise a jour'); // Correction sans accents
  });

  // Test de suppression d'une réservation
  test('Suppression d\'une reservation', async () => {
    const response = await request(app)
      .delete(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation supprimee'); // Correction sans accents
  });

  // Test de suppression d'une réservation par un administrateur
  test('Suppression d\'une reservation (admin uniquement)', async () => {
    // Re-crée une réservation pour ce test
    const newReservation = await Reservation.create({
      idUtilisateur: utilisateur.idUtilisateur,
      idTrajet: trajet.idTrajet,
      DateReservation: '2024-09-18T10:00:00Z'
    });

    const response = await request(app)
      .delete(`/api/reservations/${newReservation.idReservation}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation supprimee'); // Correction sans accents
  });
});

