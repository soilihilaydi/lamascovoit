import request from 'supertest';
import express from 'express';
import trajetRoutes from '../../../src/routes/trajetRoutes.js';
import Trajet from '../../../src/models/trajetModel.js';

const app = express();
app.use(express.json());
app.use('/trajets', trajetRoutes);

// Mock du modèle Trajet pour éviter les appels réels à la base de données
jest.mock('../../../src/models/trajetModel.js');

describe('Trajet Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un nouveau trajet', async () => {
    const trajetData = {
      Depart: 'Paris',
      Arrivee: 'Lyon',
      DateHeure: '2024-05-18T10:00:00Z',
      PlacesDisponibles: 20,
      Prix: 30.5
    };

    Trajet.create.mockResolvedValue({ idTrajet: 1, ...trajetData });

    const response = await request(app)
      .post('/trajets')
      .send(trajetData);

    expect(response.status).toBe(201);
    expect(response.body.Depart).toBe('Paris');
    expect(response.body.Arrivee).toBe('Lyon');
    expect(Trajet.create).toHaveBeenCalledWith(trajetData);
  });

  it('devrait retourner tous les trajets', async () => {
    const trajets = [
      { idTrajet: 1, Depart: 'Paris', Arrivee: 'Lyon', DateHeure: '2024-05-18T10:00:00Z', PlacesDisponibles: 20, Prix: 30.5 },
      { idTrajet: 2, Depart: 'Marseille', Arrivee: 'Nice', DateHeure: '2024-05-19T14:00:00Z', PlacesDisponibles: 15, Prix: 25.0 }
    ];

    Trajet.findAll.mockResolvedValue(trajets);

    const response = await request(app)
      .get('/trajets');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].Depart).toBe('Paris');
    expect(Trajet.findAll).toHaveBeenCalled();
  });

  it('devrait retourner un trajet par ID', async () => {
    const trajet = { idTrajet: 1, Depart: 'Paris', Arrivee: 'Lyon', DateHeure: '2024-05-18T10:00:00Z', PlacesDisponibles: 20, Prix: 30.5 };

    Trajet.findByPk.mockResolvedValue(trajet);

    const response = await request(app)
      .get('/trajets/1');

    expect(response.status).toBe(200);
    expect(response.body.Depart).toBe('Paris');
    expect(Trajet.findByPk).toHaveBeenCalledWith('1');
  });

  it('devrait mettre à jour un trajet', async () => {
    const trajet = { idTrajet: 1, Depart: 'Paris', Arrivee: 'Lyon', DateHeure: '2024-05-18T10:00:00Z', PlacesDisponibles: 20, Prix: 30.5 };
    const updatedTrajet = { Depart: 'Paris', Arrivee: 'Marseille', DateHeure: '2024-05-18T10:00:00Z', PlacesDisponibles: 18, Prix: 35.0 };

    Trajet.findByPk.mockResolvedValue(trajet);
    trajet.save = jest.fn().mockResolvedValue(updatedTrajet);

    const response = await request(app)
      .put('/trajets/1')
      .send(updatedTrajet);

    expect(response.status).toBe(200);
    expect(response.body.Arrivee).toBe('Marseille');
    expect(trajet.save).toHaveBeenCalled();
  });

  it('devrait supprimer un trajet', async () => {
    const trajet = { idTrajet: 1, Depart: 'Paris', Arrivee: 'Lyon', DateHeure: '2024-05-18T10:00:00Z', PlacesDisponibles: 20, Prix: 30.5 };

    Trajet.findByPk.mockResolvedValue(trajet);
    trajet.destroy = jest.fn().mockResolvedValue();

    const response = await request(app)
      .delete('/trajets/1');

    expect(response.status).toBe(204);
    expect(trajet.destroy).toHaveBeenCalled();
  });
});
