import Utilisateur from '../models/utilisateurModel.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Utilisateur.findOne({ where: { email } });
    if (existingUser) {
      console.log('Utilisateur existant');
      return res.status(400).json({ error: 'Cet e-mail est déjà enregistré' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const newUser = await Utilisateur.create({ nom, email, password: hashedPassword });

    // Générer un token JWT
    const token = jwt.sign({ idUtilisateur: newUser.idUtilisateur }, process.env.JWT_SECRET);

    console.log('Nouvel utilisateur créé');
    return res.status(201).json({ token, user: { idUtilisateur: newUser.idUtilisateur, nom, email } });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement :', error);
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer un token JWT
    const token = jwt.sign({ idUtilisateur: user.idUtilisateur }, process.env.JWT_SECRET);

    console.log('Utilisateur connecté');
    return res.status(200).json({ token, user: { idUtilisateur: user.idUtilisateur, nom: user.nom, email: user.email } });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(400).json({ error: error.message });
  }
};