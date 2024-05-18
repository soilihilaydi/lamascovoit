// authMiddleware.js

import jwt from 'jsonwebtoken';
import { Utilisateur } from '../models/utilisateurModel.js';

export const authMiddleware = async (req, res, next) => {
  // Récupérer le token d'authentification depuis les en-têtes de la requête
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authentification nécessaire' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur correspondant au token existe dans la base de données
    const utilisateur = await Utilisateur.findByPk(decoded.id);

    if (!utilisateur) {
      throw new Error();
    }

    // Ajouter l'utilisateur au corps de la requête pour une utilisation ultérieure
    req.utilisateur = utilisateur;
    next(); // Passer au prochain middleware ou à la route finale
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};