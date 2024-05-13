import Utilisateur from '../models/utilisateurModel.js';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

// Obtention du profil de l'utilisateur
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.idUtilisateur;
    const utilisateur = await Utilisateur.findByPk(userId, {
      attributes: ['idUtilisateur', 'nom', 'email', 'adresse', 'telephone', 'photoUrl'],
    });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    next(error);
  }
};

// Mise à jour du profil de l'utilisateur
export const updateUserProfile = async (req, res, next) => {
  try {
    const { nom, adresse, telephone, photoUrl } = req.body;
    const userId = req.user.idUtilisateur;
    const utilisateur = await Utilisateur.findByPk(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await utilisateur.update({ nom, adresse, telephone, photoUrl });
    res.json(utilisateur);
  } catch (error) {
    next(error);
  }
};

// Fonction d'inscription
export const inscription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password, nom, adresse, telephone, photoUrl, role } = req.body;
    const utilisateurExistant = await Utilisateur.findOne({ where: { email } });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
    }
    const motDePasseHash = await bcrypt.hash(password, 10);
    const nouvelUtilisateur = await Utilisateur.create({
      email,
      password: motDePasseHash,
      nom,
      adresse,
      telephone,
      photoUrl,
      role
    });
    res.status(201).json({ message: 'Utilisateur créé avec succès.', utilisateur: nouvelUtilisateur });
  } catch (error) {
    next(error);
  }
};