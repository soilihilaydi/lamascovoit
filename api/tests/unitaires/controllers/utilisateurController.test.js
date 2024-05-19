import { creerUtilisateur, obtenirTousLesUtilisateurs, obtenirUtilisateurParId, mettreAJourUtilisateur, supprimerUtilisateur } from '../../../src/controllers/utilisateurController.js';
import { Utilisateur } from '../../../src/models/utilisateurModel.js';

// Mock du modèle Utilisateur
jest.mock('../../../src/models/utilisateurModel.js');

describe('Utilisateur Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    Utilisateur.create.mockResolvedValue(mockUser);
    req.body = { name: 'Test User' };

    await creerUtilisateur(req, res);

    expect(Utilisateur.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should handle errors when creating a new user', async () => {
    const errorMessage = 'Failed to create user';
    Utilisateur.create.mockRejectedValue(new Error(errorMessage));

    await creerUtilisateur(req, res);

    expect(Utilisateur.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user' });
  });

  it('should fetch all users', async () => {
    const mockUsers = [{ id: 1, name: 'Test User' }];
    Utilisateur.findAll.mockResolvedValue(mockUsers);

    await obtenirTousLesUtilisateurs(req, res);

    expect(Utilisateur.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('should handle errors when fetching all users', async () => {
    const errorMessage = 'Failed to fetch users';
    Utilisateur.findAll.mockRejectedValue(new Error(errorMessage));

    await obtenirTousLesUtilisateurs(req, res);

    expect(Utilisateur.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch users' });
  });

  it('should fetch a user by ID', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    Utilisateur.findByPk.mockResolvedValue(mockUser);
    req.params.id = 1;

    await obtenirUtilisateurParId(req, res);

    expect(Utilisateur.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 if user not found by ID', async () => {
    Utilisateur.findByPk.mockResolvedValue(null);
    req.params.id = 1;

    await obtenirUtilisateurParId(req, res);

    expect(Utilisateur.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should handle errors when fetching a user by ID', async () => {
    const errorMessage = 'Failed to fetch user';
    Utilisateur.findByPk.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await obtenirUtilisateurParId(req, res);

    expect(Utilisateur.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
  });

  it('should update a user by ID', async () => {
    const mockUser = { id: 1, name: 'Updated User' };
    Utilisateur.update.mockResolvedValue([1]);
    Utilisateur.findByPk.mockResolvedValue(mockUser);
    req.params.id = 1;
    req.body = { name: 'Updated User' };

    await mettreAJourUtilisateur(req, res);

    expect(Utilisateur.update).toHaveBeenCalledWith(req.body, { where: { idUtilisateur: req.params.id } });
    expect(Utilisateur.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 if user to update not found', async () => {
    Utilisateur.update.mockResolvedValue([0]);
    req.params.id = 1;
    req.body = { name: 'Updated User' };

    await mettreAJourUtilisateur(req, res);

    expect(Utilisateur.update).toHaveBeenCalledWith(req.body, { where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should handle errors when updating a user by ID', async () => {
    const errorMessage = 'Failed to update user';
    Utilisateur.update.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;
    req.body = { name: 'Updated User' };

    await mettreAJourUtilisateur(req, res);

    expect(Utilisateur.update).toHaveBeenCalledWith(req.body, { where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update user' });
  });

  it('should delete a user by ID', async () => {
    Utilisateur.destroy.mockResolvedValue(1);
    req.params.id = 1;

    await supprimerUtilisateur(req, res);

    expect(Utilisateur.destroy).toHaveBeenCalledWith({ where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should return 404 if user to delete not found', async () => {
    Utilisateur.destroy.mockResolvedValue(0);
    req.params.id = 1;

    await supprimerUtilisateur(req, res);

    expect(Utilisateur.destroy).toHaveBeenCalledWith({ where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should handle errors when deleting a user by ID', async () => {
    const errorMessage = 'Failed to delete user';
    Utilisateur.destroy.mockRejectedValue(new Error(errorMessage));
    req.params.id = 1;

    await supprimerUtilisateur(req, res);

    expect(Utilisateur.destroy).toHaveBeenCalledWith({ where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
  });
});
