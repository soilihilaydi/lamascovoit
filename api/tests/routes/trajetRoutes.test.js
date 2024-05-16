import authMiddleware from '../../src/middlewares/authMiddleware.js';
import Utilisateur from '../../src/models/utilisateurModel.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  const mockUser = {
    idUtilisateur: 1,
    Email: 'test@example.com',
    MotDePasse: 'hashedPassword',
    Nom: 'John Doe',
    Adresse: '123 Main St',
    NuméroDeTéléphone: '1234567890',
    PhotoUrl: 'https://example.com/photo.jpg',
    Rôle: 'passager'
  };

  const mockNext = jest.fn();
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.spyOn(Utilisateur, 'findByPk').mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Jeton JWT valide', async () => {
    const mockReq = {
      headers: {
        authorization: `Bearer ${jwt.sign({ idUtilisateur: 1 }, process.env.JWT_SECRET)}`
      }
    };
    const mockRes = mockResponse();

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Jeton JWT invalide', async () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer invalidToken'
      }
    };
    const mockRes = mockResponse();

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Jeton JWT invalide ou expiré' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Jeton JWT manquant', async () => {
    const mockReq = {
      headers: {}
    };
    const mockRes = mockResponse();

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Jeton JWT manquant' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});