import jwt from 'jsonwebtoken';
import Utilisateur from '../models/utilisateurModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

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

// Middleware pour vérifier si l'utilisateur est admin
export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await Utilisateur.findByPk(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé : droits d\'administrateur requis' });
    }
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification des droits d\'administrateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};








