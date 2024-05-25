import { verifyToken } from '../../../src/middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  test('devrait vérifier un jeton JWT valide', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer valid.token.here')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jwt.verify = jest.fn().mockReturnValue({ id: 'userId' });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', process.env.JWT_SECRET);
    expect(req.userId).toEqual('userId');
    expect(next).toHaveBeenCalled();
  });

  test('devrait renvoyer une erreur pour un jeton JWT non valide', () => {
    const req = {
      get: jest.fn().mockReturnValue('Bearer invalid.token.here')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jwt.verify = jest.fn(() => {
      throw new Error('Token invalide');
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('invalid.token.here', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  test('devrait renvoyer une erreur si aucun jeton n\'est fourni', () => {
    const req = {
      get: jest.fn().mockReturnValue(null)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé : aucun token fourni' });
    expect(next).not.toHaveBeenCalled();
  });
});



