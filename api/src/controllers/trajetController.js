import Trajet from '../models/trajetModel.js';

export const createTrajet = async (req, res) => {
  console.log('createTrajet appelé');
  const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;  // Noms sans accents
  try {
    const trajet = await Trajet.create({ Depart, Arrivee, DateHeure, PlacesDisponibles, Prix });  // Utilisation des bons noms de champs
    res.status(201).json({ message: 'Trajet créé', trajet });
  } catch (error) {
    console.error('Erreur lors de la création du trajet:', error);
    res.status(500).json({ message: 'Erreur lors de la création du trajet', error });
  }
};

export const getTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.findAll();
    res.status(200).json(trajets);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des trajets', error });
  }
};

export const getTrajet = async (req, res) => {
  const { id } = req.params;
  try {
    const trajet = await Trajet.findByPk(id);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    res.status(200).json(trajet);
  } catch (error) {
    console.error('Erreur lors de la récupération du trajet:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du trajet', error });
  }
};

export const updateTrajet = async (req, res) => {
  const { id } = req.params;
  const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;  // Noms sans accents
  try {
    const trajet = await Trajet.findByPk(id);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    await trajet.update({ Depart, Arrivee, DateHeure, PlacesDisponibles, Prix });  // Utilisation des bons noms de champs
    res.status(200).json({ message: 'Trajet mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du trajet:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du trajet', error });
  }
};

export const deleteTrajet = async (req, res) => {
  const { id } = req.params;
  try {
    const trajet = await Trajet.findByPk(id);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    await trajet.destroy();
    res.status(200).json({ message: 'Trajet supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du trajet:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du trajet', error });
  }
};
