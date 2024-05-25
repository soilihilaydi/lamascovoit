import Utilisateur from '../models/utilisateurModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Sequelize } from 'sequelize';

// Fonction pour l'inscription d'un utilisateur
export const register = async (req, res) => {
  try {
    const { Email, MotDePasse, Nom } = req.body;
    const hashedPassword = await bcrypt.hash(MotDePasse, 10);
    const newUser = await Utilisateur.create({ Email, MotDePasse: hashedPassword, Nom });
    res.status(201).json({ message: 'Utilisateur enregistré', user: newUser });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({ message: 'Un utilisateur avec cette adresse email existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, MotDePasse } = req.body;

    if (!Email || !MotDePasse) {
      return res.status(400).json({ message: 'Les champs Email et MotDePasse sont obligatoires' });
    }

    const user = await Utilisateur.findOne({ where: { Email } });
    if (!user || !await bcrypt.compare(MotDePasse, user.MotDePasse)) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign({ id: user.idUtilisateur }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion de l\'utilisateur', error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await user.update(req.body);
    res.status(200).json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du profil', error });
  }
};





