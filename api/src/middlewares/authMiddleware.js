import jwt from 'jsonwebtoken';
import Utilisateur from '../models/utilisateurModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'process.env.JWT_SECRET';

// Middleware pour vérifier la présence et la validité du token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format : "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé : aucun token fourni' });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id; // Injecte l'ID utilisateur dans la requête
    next(); // Poursuit la chaîne middleware
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    return res.status(500).json({ message: 'Erreur d\'authentification' });
  }
};





