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

  it('should create a new trajet', async () => {
    const trajetData = { Depart: 'A', Arrivee: 'B', DateHeure: '2022-12-12', PlacesDisponibles: 4, Prix: 20 };
    Trajet.create.mockResolvedValue({ ...trajetData, id: 1 });
    req.body = trajetData;

    await createTrajet(req, res);

    expect(Trajet.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ...trajetData, id: 1 });
  });

  it('should handle errors when creating a new trajet', async () => {
    const errorMessage = 'Error creating trajet';
    Trajet.create.mockRejectedValue(new Error(errorMessage));
    req.body = {};

    await createTrajet(req, res);

    expect(Trajet.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should fetch all trajets', async () => {
    const trajets = [{ id: 1, Depart: 'A', Arrivee: 'B' }];
    Trajet.findAll.mockResolvedValue(trajets);

    await getAllTrajets(req, res);

    expect(Trajet.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trajets);
  });

  it('should handle errors when fetching all trajets', async () => {
    const errorMessage = 'Error fetching trajets';
    Trajet.findAll.mockRejectedValue(new Error(errorMessage));

    await getAllTrajets(req, res);

    expect(Trajet.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should fetch a trajet by ID', async () => {
    const trajet = { id: 1, Depart: 'A', Arrivee: 'B' };
    Trajet.findByPk.mockResolvedValue(trajet);
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(trajet);
  });

  it('should return 404 if trajet not found by ID', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('should handle errors when fetching a trajet by ID', async () => {
    const errorMessage = 'Error fetching trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await getTrajetById(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should update a trajet by ID', async () => {
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

  it('should return 404 if trajet to update not found', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;
    req.body = { Depart: 'C', Arrivee: 'D' };

    await updateTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('should handle errors when updating a trajet by ID', async () => {
    const errorMessage = 'Error updating trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;
    req.body = { Depart: 'C', Arrivee: 'D' };

    await updateTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should delete a trajet by ID', async () => {
    Trajet.findByPk.mockResolvedValue(mockTrajet);
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(mockTrajet.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });

  it('should return 404 if trajet to delete not found', async () => {
    Trajet.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Trajet non trouvé' });
  });

  it('should handle errors when deleting a trajet by ID', async () => {
    const errorMessage = 'Error deleting trajet';
    Trajet.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await deleteTrajet(req, res);

    expect(Trajet.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
