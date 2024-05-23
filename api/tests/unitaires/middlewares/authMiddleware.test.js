import { verifyToken } from '../../../src/middlewares/authMiddleware'; // Importation nommée
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  it('devrait vérifier un jeton JWT valide', () => {
    const user = { id: 1 };
    const token = jwt.sign(user, process.env.JWT_SECRET);

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(req.userId).toBe(user.id);
    expect(next).toHaveBeenCalled();
  });

  it('devrait renvoyer une erreur pour un jeton JWT non valide', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidtoken'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait renvoyer une erreur si aucun jeton n est fourni', () => {
    const req = {
      headers: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token non fourni' });
    expect(next).not.toHaveBeenCalled();
  });
});
