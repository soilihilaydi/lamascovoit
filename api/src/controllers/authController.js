import Utilisateur from '../models/utilisateurModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, nom, adresse, telephone, photoUrl, role } = req.body;
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email déjà utilisé.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Utilisateur.create({
      email,
      password: hashedPassword,
      nom,
      adresse,
      telephone,
      photoUrl,
      role
    });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Change userId to id
    res.status(201).json({ token, userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Change userId to id
    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
};