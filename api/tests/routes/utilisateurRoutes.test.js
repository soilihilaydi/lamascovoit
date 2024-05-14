import authMiddleware from '../../src/middlewares/authMiddleware.js';

const mockNext = jest.fn();

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Middleware', () => {
  it('Jeton JWT invalide', async () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer invalidToken' // Jeton JWT invalide
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const mockNext = jest.fn();

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401); // [1]
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Jeton JWT invalide ou expiré' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

  test('Jeton JWT invalide', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer tokenInvalide',
      },
    };

    const res = mockResponse();

    await authMiddleware(mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({ message: 'Jeton JWT invalide ou expiré' });

    expect(mockNext).not.toHaveBeenCalled();
  });

