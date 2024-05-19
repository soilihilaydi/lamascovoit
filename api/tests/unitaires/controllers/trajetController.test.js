import {
  createTrajet,
  getAllTrajets,
  getTrajetById,
  updateTrajet,
  deleteTrajet,
} from '../../../src/controllers/trajetController.js';
import Trajet from '../../../src/models/trajetModel.js';

// Mock du modèle Trajet
jest.mock('../../../src/models/trajetModel.js');

describe('Trajet Controller', () => {
  let req;
  let res;
  let mockTrajet;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockTrajet = {
      save: jest.fn(),
      destroy: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un nouveau trajet', async () => {
    const trajetData = { Depart: 'A', Arrivee: 'B', DateHeure: '2022-12-12', PlacesDisponibles: 4, Prix: 20 };
    Trajet.create.mockResolvedValue({ ...trajetData, id: 1 });
    req.body = trajetData;

    await createTrajet(req, res);

    expect(Trajet.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ...trajetData, id: 1 });
  });

  it('devrait gérer les erreurs lors de la création d un nouveau trajet', async () => {
    const errorMessage = 'Error creating trajet';
    Trajet.create.mockRejectedValue(new Error(errorMessage));
    req.body = {};

    await createTrajet(req, res);

    expect(Trajet.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('devrait récupérer tous les trajets', async () => {
    const trajets = [{ id: 1, Depart: 'A', Arrivee: 'B' }];
    Trajet.findAll.mockResolvedValue(trajets);

    await getAllTrajets(req, res);

    expect(Trajet.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trajets);
  });

  it('devrait gérer les erreurs lors de la récupération de tous les trajets', async () => {
    const errorMessage = 'Error fetching trajets';
    Trajet.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllTrajets(req, res);

    expect(Trajet.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('devrait aller chercher un trajet par ID', async () => {
    const trajet = { id: 1, Depart: 'A', Arrivee: 'B' };
    Trajet.findByPk.mockResolvedValue(trajet);
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trajet);
  });

  it('devrait retourner 404 si le trajet n est pas trouvé par ID', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('devrait gérer les erreurs lors de la récupération d un trajet par ID', async () => {
    const errorMessage = 'Error fetching trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('devrait mettre à jour un trajet par ID', async () => {
    const updatedTrajetData = { Depart: 'C', Arrivee: 'D', DateHeure: '2022-12-13', PlacesDisponibles: 3, Prix: 30 };
    Trajet.findByPk.mockResolvedValue(mockTrajet);
    req.params.id = 1;
    req.body = updatedTrajetData;

    await updateTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(mockTrajet.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTrajet);
  });

  it('devrait renvoyer 404 si le trajet à mettre à jour est introuvable', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;
    req.body = { Depart: 'C', Arrivee: 'D' };

    await updateTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('devrait gérer les erreurs lors de la mise à jour d un trajet par ID', async () => {
    const errorMessage = 'Error updating trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;
    req.body = { Depart: 'C', Arrivee: 'D' };

    await updateTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('devrait supprimer un trajet par ID', async () => {
    Trajet.findByPk.mockResolvedValue(mockTrajet);
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(mockTrajet.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });

  it('devrait renvoyer 404 si le trajet à supprimer est introuvable', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('devrait gérer les erreurs lors de la suppression d un trajet par ID', async () => {
    const errorMessage = 'Error deleting trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
