import Utilisateur from '../models/utilisateurModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.id, {
      attributes: ['id', 'email', 'nom', 'adresse', 'telephone', 'photoUrl', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { nom, adresse, telephone, photoUrl } = req.body;

    const user = await Utilisateur.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.update({ nom, adresse, telephone, photoUrl });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await Utilisateur.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.destroy();

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};