import httpMocks from 'node-mocks-http';
import Trajet from '../../src/models/trajetModel.js';
import { createTrajet } from '../../src/controllers/trajetController.js';

jest.mock('../../src/models/trajetModel.js');

describe('createTrajet', () => {
  it('devrait créer un nouveau trajet', async () => {
    const trajetData = {
      Depart: 'Paris',
      Arrivee: 'Marseille',
      DateHeure: '2023-06-01T10:00:00Z',
      PlacesDisponibles: 4,
      Prix: 50
    };

    const req = httpMocks.createRequest({
      body: trajetData
    });
    const res = httpMocks.createResponse();

    Trajet.create.mockResolvedValue(trajetData);

    await createTrajet(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(trajetData);
  });
});
