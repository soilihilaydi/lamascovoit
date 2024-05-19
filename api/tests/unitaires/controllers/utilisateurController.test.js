// Importer les modules nécessaires
import { creerUtilisateur, obtenirTousLesUtilisateurs, obtenirUtilisateurParId, mettreAJourUtilisateur, supprimerUtilisateur } from '../../../src/controllers/utilisateurController.js';
import { Utilisateur } from '../../../src/models/utilisateurModel.js';

// Mock pour le modèle Utilisateur
jest.mock('../../../src/models/utilisateurModel.js', () => ({
  Utilisateur: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('Tests pour les fonctions du contrôleur utilisateur', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creerUtilisateur devrait créer un nouvel utilisateur avec succès', async () => {
    const req = { body: { /* Données de l'utilisateur */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.create.mockResolvedValue(req.body);

    await creerUtilisateur(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('obtenirTousLesUtilisateurs devrait renvoyer tous les utilisateurs', async () => {
    const utilisateurs = [{ id: 1, nom: 'John' }, { id: 2, nom: 'Jane' }];
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.findAll.mockResolvedValue(utilisateurs);

    await obtenirTousLesUtilisateurs(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateurs);
  });

  it('obtenirUtilisateurParId devrait renvoyer un utilisateur par ID s\'il existe', async () => {
    const utilisateur = { id: 1, nom: 'John' };
    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.findByPk.mockResolvedValue(utilisateur);

    await obtenirUtilisateurParId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(utilisateur);
  });

  it('obtenirUtilisateurParId devrait renvoyer une erreur 404 si l\'utilisateur n\'existe pas', async () => {
    const req = { params: { id: 999 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.findByPk.mockResolvedValue(null);

    await obtenirUtilisateurParId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('mettreAJourUtilisateur devrait mettre à jour un utilisateur par ID', async () => {
    const req = { params: { id: 1 }, body: { nom: 'Updated Name' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.update.mockResolvedValue([1]); // Un utilisateur mis à jour

    await mettreAJourUtilisateur(req, res);

    expect(Utilisateur.update).toHaveBeenCalledWith(req.body, { where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('mettreAJourUtilisateur devrait renvoyer une erreur 404 si l\'utilisateur n\'existe pas', async () => {
    const req = { params: { id: 999 }, body: { nom: 'Updated Name' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.update.mockResolvedValue([0]); // Aucun utilisateur mis à jour

    await mettreAJourUtilisateur(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('supprimerUtilisateur devrait supprimer un utilisateur par ID', async () => {
    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    Utilisateur.destroy.mockResolvedValue(1); // Un utilisateur supprimé

    await supprimerUtilisateur(req, res);

    expect(Utilisateur.destroy).toHaveBeenCalledWith({ where: { idUtilisateur: req.params.id } });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('supprimerUtilisateur devrait renvoyer une erreur 404 si l\'utilisateur n\'existe pas', async () => {
    const req = { params: { id: 999 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Utilisateur.destroy.mockResolvedValue(0); // Aucun utilisateur supprimé

    await supprimerUtilisateur(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});

