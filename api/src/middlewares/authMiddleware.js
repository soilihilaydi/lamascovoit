import jwt from 'jsonwebtoken';
import Utilisateur from '../models/utilisateurModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le jeton JWT depuis les en-têtes de la requête
    const token = req.headers.authorization.split(' ')[1];

    // Vérifier et décoder le jeton JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur correspondant
    const user = await Utilisateur.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Ajouter l'utilisateur authentifié à l'objet de requête
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Utilisateur non authentifié' });
  }
};

export default authMiddleware;