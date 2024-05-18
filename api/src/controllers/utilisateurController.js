import { Utilisateur } from '../models/utilisateurModel.js';

// Créer un nouvel utilisateur
export const creerUtilisateur = async (req, res) => {
  try {
    const nouvelUtilisateur = await Utilisateur.create(req.body);
    res.status(201).json(nouvelUtilisateur);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Obtenir tous les utilisateurs
export const obtenirTousLesUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll();
    res.status(200).json(utilisateurs);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Obtenir un utilisateur par ID
export const obtenirUtilisateurParId = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (utilisateur) {
      res.status(200).json(utilisateur);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Mettre à jour un utilisateur par ID
export const mettreAJourUtilisateur = async (req, res) => {
  try {
    const [updatedRows] = await Utilisateur.update(req.body, {
      where: { idUtilisateur: req.params.id }
    });
    if (updatedRows > 0) {
      const utilisateur = await Utilisateur.findByPk(req.params.id);
      res.status(200).json(utilisateur);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Supprimer un utilisateur par ID
export const supprimerUtilisateur = async (req, res) => {
  try {
    const deletedRows = await Utilisateur.destroy({
      where: { idUtilisateur: req.params.id }
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
