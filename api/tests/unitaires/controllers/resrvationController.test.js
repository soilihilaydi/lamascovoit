import request from 'supertest';
import express from 'express';
import { createReservation, getReservations, getReservationById, updateReservation, deleteReservation } from '../../../src/controllers/reservationController.js';
import Reservation from '../../../src/models/reservationModel.js';

// Mock du modèle Reservation
jest.mock('../../../src/models/reservationModel.js', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post('/api/reservations', createReservation);
app.get('/api/reservations', getReservations);
app.get('/api/reservations/:id', getReservationById);
app.put('/api/reservations/:id', updateReservation);
app.delete('/api/reservations/:id', deleteReservation);

describe('Reservation Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/reservations devrait créer une réservation', async () => {
    const mockReservation = { idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date().toISOString() };
    Reservation.create.mockResolvedValue(mockReservation);

    const response = await request(app)
      .post('/api/reservations')
      .send({ idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Réservation créée');
    expect(response.body.reservation).toEqual(mockReservation);
  });

  test('GET /api/reservations devrait récupérer toutes les réservations', async () => {
    const mockReservations = [{ idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date().toISOString() }];
    Reservation.findAll.mockResolvedValue(mockReservations);

    const response = await request(app).get('/api/reservations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReservations);
  });

  test('GET /api/reservations/:id devrait récupérer une réservation par ID', async () => {
    const mockReservation = { idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date().toISOString() };
    Reservation.findByPk.mockResolvedValue(mockReservation);

    const response = await request(app).get('/api/reservations/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReservation);
  });

  test('GET /api/reservations/:id devrait retourner 404 si la réservation n\'est pas trouvée', async () => {
    Reservation.findByPk.mockResolvedValue(null);

    const response = await request(app).get('/api/reservations/1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Réservation non trouvée');
  });

  test('PUT /api/reservations/:id devrait mettre à jour une réservation', async () => {
    const mockReservation = { idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date().toISOString() };
    Reservation.findByPk.mockResolvedValue(mockReservation);
    Reservation.update.mockResolvedValue([1]);

    const response = await request(app)
      .put('/api/reservations/1')
      .send({ idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Réservation mise à jour');
  });

  test('DELETE /api/reservations/:id devrait supprimer une réservation', async () => {
    const mockReservation = { idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date().toISOString() };
    Reservation.findByPk.mockResolvedValue(mockReservation);
    Reservation.destroy.mockResolvedValue(1);

    const response = await request(app).delete('/api/reservations/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Réservation supprimée');
  });

  test('DELETE /api/reservations/:id devrait retourner 404 si la réservation n\'est pas trouvée', async () => {
    Reservation.findByPk.mockResolvedValue(null);

    const response = await request(app).delete('/api/reservations/1');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Réservation non trouvée');
  });
});