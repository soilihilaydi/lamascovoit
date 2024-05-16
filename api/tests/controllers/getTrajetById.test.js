import httpMocks from 'node-mocks-http';
import Trajet from '../../src/models/trajetModel.js';
import { getTrajetById } from '../../src/controllers/trajetController.js';

jest.mock('../../src/models/trajetModel.js');

describe('getTrajetById', () => {
  it('devrait récupérer un trajet par son identifiant', async () => {
    const trajetData = {
      id: 1,
      Depart: 'Paris',
      Arrivee: 'Marseille',
      DateHeure: '2023-06-01T10:00:00Z',
      PlacesDisponibles: 4,
      Prix: 50
    };

    const req = httpMocks.createRequest({
      params: {
        id: 1
      }
    });
    const res = httpMocks.createResponse();

    Trajet.findByPk.mockResolvedValue(trajetData);

    await getTrajetById(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(trajetData);
  });

  it('devrait renvoyer une erreur 404 si le trajet n\'est pas trouvé', async () => {
    const req = httpMocks.createRequest({
      params: {
        id: 999
      }
    });
    const res = httpMocks.createResponse();

    Trajet.findByPk.mockResolvedValue(null);

    await getTrajetById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Trajet non trouvé' });
  });
});
