import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'process.env.JWT_SECRET';

export const verifyToken = (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé : aucun token fourni' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token invalide' });
  }
};




