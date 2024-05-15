
import { getProfile, updateProfile, deleteProfile } from '../../src/controllers/utilisateurController.js';

jest.mock('../../src/models/utilisateurModel.js', () => ({
  findByPk: jest.fn(),
}));

describe('Utilisateur Controller', () => {
  let mockReq;
  let mockRes;
  let findByPk;

  beforeEach(() => {
    mockReq = {
      user: {
        idUtilisateur: 'mockUserId'
      },
      body: {
        nom: 'Updated Name',
        adresse: 'Updated Address',
        telephone: 'Updated Phone',
        photoUrl: 'Updated Photo'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
    const { findByPk: mockFindByPk } = require('../../src/models/utilisateurModel.js');
    findByPk = mockFindByPk;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Utilisateur trouvé', async () => {
    const mockUser = { idUtilisateur: 'mockUserId', email: 'mock@email.com', nom: 'Mock User' };
    findByPk.mockResolvedValueOnce(mockUser);

    await getProfile(mockReq, mockRes);

    expect(findByPk).toHaveBeenCalledWith('mockUserId', { attributes: ['idUtilisateur', 'email', 'nom', 'adresse', 'telephone', 'photoUrl', 'role'] });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUser);
  });

  it('Utilisateur trouvé et mis à jour', async () => {
    const mockUser = { idUtilisateur: 'mockUserId', update: jest.fn() };
    findByPk.mockResolvedValueOnce(mockUser);

    await updateProfile(mockReq, mockRes);

    expect(findByPk).toHaveBeenCalledWith('mockUserId');
    expect(mockUser.update).toHaveBeenCalledWith({ nom: 'Updated Name', adresse: 'Updated Address', telephone: 'Updated Phone', photoUrl: 'Updated Photo' });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUser);
  });

  it('Utilisateur trouvé et supprimé', async () => {
    const mockUser = { idUtilisateur: 'mockUserId', destroy: jest.fn() };
    findByPk.mockResolvedValueOnce(mockUser);

    await deleteProfile(mockReq, mockRes);

    expect(findByPk).toHaveBeenCalledWith('mockUserId');
    expect(mockUser.destroy).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.end).toHaveBeenCalled();
  });
});