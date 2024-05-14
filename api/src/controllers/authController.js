import Utilisateur from '../models/utilisateurModel.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, nom, adresse, telephone, photoUrl, role } = req.body;

    // Hashage du mot de passe
    const hashedPassword = await Utilisateur.hashPassword(password);

    const newUser = await Utilisateur.create({
      email,
      password: hashedPassword,
      nom,
      adresse,
      telephone,
      photoUrl,
      role
    });

    // Génération du jeton JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);

    res.status(201).json({ ...newUser.toJSON(), token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isValid = await Utilisateur.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Génération du jeton JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
