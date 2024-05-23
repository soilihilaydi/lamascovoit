import request from 'supertest';
import express from 'express';
import reservationRoutes from '../../../src/routes/reservationRoutes.js';
import Reservation from '../../../src/models/reservationModel.js';
import { verifyToken } from '../../../src/middlewares/authMiddleware.js';

jest.mock('../../../src/middlewares/authMiddleware.js', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 1;
    next();
  },
}));

jest.mock('../../../src/models/reservationModel.js', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/reservations', reservationRoutes);

describe('Reservation Routes', () => {
  test('POST /api/reservations should create a reservation', async () => {
    Reservation.create.mockResolvedValue({ idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() });
    const response = await request(app)
      .post('/api/reservations')
      .send({ idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Réservation créée');
  });

  test('GET /api/reservations should get all reservations', async () => {
    Reservation.findAll.mockResolvedValue([{ idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() }]);
    const response = await request(app).get('/api/reservations');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('GET /api/reservations/:id should get a single reservation', async () => {
    Reservation.findByPk.mockResolvedValue({ idReservation: 1, idUtilisateur: 1, idTrajet: 1, DateReservation: new Date() });
    const response = await request(app).get('/api/reservations/1');

    expect(response.status).toBe(200);
    expect(response.body.idReservation).toBe(1);
  });

  test('PUT /api/reservations/:id should update a reservation', async () => {
    const reservation = {
      idReservation: 1,
      idUtilisateur: 1,
      idTrajet: 1,
      DateReservation: new Date(),
      update: jest.fn().mockResolvedValue(true),
    };
    Reservation.findByPk.mockResolvedValue(reservation);
    const response = await request(app)
      .put('/api/reservations/1')
      .send({ DateReservation: new Date() });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Réservation mise à jour');
  });

  test('DELETE /api/reservations/:id should delete a reservation', async () => {
    const reservation = {
      idReservation: 1,
      idUtilisateur: 1,
      idTrajet: 1,
      DateReservation: new Date(),
      destroy: jest.fn().mockResolvedValue(true),
    };
    Reservation.findByPk.mockResolvedValue(reservation);
    const response = await request(app).delete('/api/reservations/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Réservation supprimée');
  });
});
