import jwt from 'jsonwebtoken';
import Utilisateur from '../models/utilisateurModel.js';

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




