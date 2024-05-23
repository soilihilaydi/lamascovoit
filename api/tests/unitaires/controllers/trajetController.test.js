import request from 'supertest';
import express from 'express';
import { createTrajet, getTrajets, getTrajet, updateTrajet, deleteTrajet } from '../../../src/controllers/trajetController.js';
import { verifyToken } from '../../../src/middlewares/authMiddleware.js';
import Trajet from '../../../src/models/trajetModel.js';

jest.mock('../../../src/middlewares/authMiddleware.js', () => ({
  verifyToken: (req, res, next) => {
    req.userId = 1;
    next();
  },
}));

jest.mock('../../../src/models/trajetModel.js', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post('/api/trajets', verifyToken, createTrajet);
app.get('/api/trajets', getTrajets);
app.get('/api/trajets/:id', getTrajet);
app.put('/api/trajets/:id', verifyToken, updateTrajet);
app.delete('/api/trajets/:id', verifyToken, deleteTrajet);

describe('Trajet Controller', () => {
  test('POST /api/trajets devrait créer un trajet', async () => {
    Trajet.create.mockResolvedValue({ idTrajet: 1, Départ: 'Paris', Arrivée: 'Lyon', DateHeure: new Date(), PlacesDisponibles: 3, Prix: 50 });
    const response = await request(app)
      .post('/api/trajets')
      .send({ Départ: 'Paris', Arrivée: 'Lyon', DateHeure: new Date(), PlacesDisponibles: 3, Prix: 50 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Trajet créé');
  });

  test('GET /api/trajets devrait obtenir tous les trajets', async () => {
    Trajet.findAll.mockResolvedValue([{ idTrajet: 1, Départ: 'Paris', Arrivée: 'Lyon', DateHeure: new Date(), PlacesDisponibles: 3, Prix: 50 }]);
    const response = await request(app).get('/api/trajets');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test('GET /api/trajets/:id devrait obtenir un trajet unique', async () => {
    Trajet.findByPk.mockResolvedValue({ idTrajet: 1, Départ: 'Paris', Arrivée: 'Lyon', DateHeure: new Date(), PlacesDisponibles: 3, Prix: 50 });
    const response = await request(app).get('/api/trajets/1');

    expect(response.status).toBe(200);
    expect(response.body.Départ).toBe('Paris');
  });

  test('PUT /api/trajets/:id devrait mettre à jour un trajet', async () => {
    const trajet = {
      idTrajet: 1,
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 50,
      update: jest.fn().mockResolvedValue(true),
    };
    Trajet.findByPk.mockResolvedValue(trajet);
    const response = await request(app)
      .put('/api/trajets/1')
      .send({ Départ: 'Marseille' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet mis à jour');
  });

  test('DELETE /api/trajets/:id devrait supprimer un trajet', async () => {
    const trajet = {
      idTrajet: 1,
      Départ: 'Paris',
      Arrivée: 'Lyon',
      DateHeure: new Date(),
      PlacesDisponibles: 3,
      Prix: 50,
      destroy: jest.fn().mockResolvedValue(true),
    };
    Trajet.findByPk.mockResolvedValue(trajet);
    const response = await request(app).delete('/api/trajets/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trajet supprimé');
  });
});
