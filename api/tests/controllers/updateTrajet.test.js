import httpMocks from 'node-mocks-http';
import Trajet from '../../src/models/trajetModel.js';
import { updateTrajet } from '../../src/controllers/trajetController.js';

jest.mock('../../src/models/trajetModel.js');

describe('updateTrajet', () => {
  it('devrait mettre à jour un trajet existant', async () => {
    const trajetData = {
      idTrajet: 1,
      Depart: 'Paris',
      Arrivee: 'Marseille',
      DateHeure: '2023-06-01T10:00:00Z',
      PlacesDisponibles: 4,
      Prix: 50
    };

    const updatedTrajetData = {
      Depart: 'Lyon',
      Arrivee: 'Bordeaux',
      DateHeure: '2023-06-02T14:00:00Z',
      PlacesDisponibles: 2,
      Prix: 60
    };

    const req = httpMocks.createRequest({
      params: {
        idTrajet: 1
      },
      body: updatedTrajetData
    });
    const res = httpMocks.createResponse();

    Trajet.update.mockResolvedValue([1, [{ ...trajetData, ...updatedTrajetData }]]);

    await updateTrajet(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ ...trajetData, ...updatedTrajetData });
  });

  it('devrait renvoyer une erreur 404 si le trajet n\'est pas trouvé', async () => {
    const req = httpMocks.createRequest({
      params: {
        idTrajet: 999
      },
      body: {
        Depart: 'Lyon',
        Arrivee: 'Bordeaux',
        DateHeure: '2023-06-02T14:00:00Z',
        PlacesDisponibles: 2,
        Prix: 60
      }
    });
    const res = httpMocks.createResponse();

    Trajet.update.mockResolvedValue([0, []]);

    await updateTrajet(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ message: 'Trajet non trouvé' });
  });
});
