import jwt from 'jsonwebtoken';
import authMiddleware from '../../src/middlewares/authMiddleware.js';

jest.mock('jsonwebtoken');
jest.mock('../../src/models/utilisateurModel.js', () => ({
  findByPk: jest.fn()
}));

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer validToken'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Jeton JWT valide', async () => {
    const mockUser = { idUtilisateur: 'mockUserId' };
    const mockDecodedToken = { idUtilisateur: mockUser.idUtilisateur };

    jwt.verify.mockReturnValueOnce(mockDecodedToken);
    const mockUtilisateurModel = require('../../src/models/utilisateurModel.js');
    mockUtilisateurModel.findByPk.mockResolvedValueOnce(mockUser);

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Jeton JWT invalide', async () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Jeton JWT invalide ou expiré' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});