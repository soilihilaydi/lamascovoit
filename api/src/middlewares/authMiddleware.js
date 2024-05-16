import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Utilisateur from '../models/utilisateurModel.js';

dotenv.config();

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      const user = await Utilisateur.findByPk(decoded.idUtilisateur);
    
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(401).json({ message: 'Jeton JWT invalide ou expiré' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Jeton JWT invalide ou expiré' });
    }
  } else {
    return res.status(401).json({ message: 'Jeton JWT manquant' });
  }
}