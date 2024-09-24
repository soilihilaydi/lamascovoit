import request from 'supertest';
import app from '../../../app.js'; 
import models from '../../../src/models/index.js'; 
import sequelize from '../../../src/config/db.config.js'; 
import jwt from 'jsonwebtoken';

const { Reservation, Utilisateur, Trajet } = models;

let token;
let utilisateur;
let trajet;
let reservation;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  utilisateur = await Utilisateur.create({
    Nom: 'Test User',
    Email: 'testuser@example.com',
    MotDePasse: 'hashedpassword', 
  });

  trajet = await Trajet.create({
    Depart: 'Lamastre',
    Arrivee: 'Valence',
    DateHeure: '2024-09-14T10:00:00Z',
    PlacesDisponibles: 3,
    Prix: 5.50
  });

  token = jwt.sign({ id: utilisateur.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Tests d\'intégration du contrôleur Reservation', () => {

  test('Création d\'une réservation', async () => {
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
    reservation = response.body.reservation;
  });

  test('Récupération de toutes les réservations', async () => {
    const response = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Récupération d\'une réservation par ID', async () => {
    const response = await request(app)
      .get(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('idReservation', reservation.idReservation);
  });

  test('Mise à jour d\'une réservation', async () => {
    const response = await request(app)
      .put(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        idUtilisateur: utilisateur.idUtilisateur,
        idTrajet: trajet.idTrajet,
        DateReservation: '2024-09-15T10:00:00Z'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation mise a jour');
  });

  test('Suppression d\'une réservation', async () => {
    const response = await request(app)
      .delete(`/api/reservations/${reservation.idReservation}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reservation supprimee');
  });
});

