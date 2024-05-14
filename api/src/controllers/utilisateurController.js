import Utilisateur from '../models/utilisateurModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.idUtilisateur, {
      attributes: ['idUtilisateur', 'email', 'nom', 'adresse', 'telephone', 'photoUrl', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du profil.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nom, adresse, telephone, photoUrl } = req.body;

    const user = await Utilisateur.findByPk(req.user.idUtilisateur);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.update({ nom, adresse, telephone, photoUrl });

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du profil.' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.idUtilisateur);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.destroy();

    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de la suppression du profil :', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du profil.' });
  }
};