import httpMocks from 'node-mocks-http';
import Trajet from '../../src/models/trajetModel.js';
import { getAllTrajets } from '../../src/controllers/trajetController.js';

jest.mock('../../src/models/trajetModel.js');

describe('getAllTrajets', () => {
  it('devrait récupérer tous les trajets', async () => {
    const trajets = [
      {
        Depart: 'Paris',
        Arrivee: 'Marseille',
        DateHeure: '2023-06-01T10:00:00Z',
        PlacesDisponibles: 4,
        Prix: 50
      },
      {
        Depart: 'Lyon',
        Arrivee: 'Bordeaux',
        DateHeure: '2023-06-02T14:00:00Z',
        PlacesDisponibles: 2,
        Prix: 60
      }
    ];

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    Trajet.findAll.mockResolvedValue(trajets);

    await getAllTrajets(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(trajets);
  });
});
