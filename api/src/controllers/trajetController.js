import Trajet from '../models/trajetModel.js';

export const createTrajet = async (req, res) => {
  console.log('createTrajet appelé'); 
  const { Départ, Arrivée, DateHeure, PlacesDisponibles, Prix } = req.body;
  try {
    const trajet = await Trajet.create({ Départ, Arrivée, DateHeure, PlacesDisponibles, Prix });
    res.status(201).json({ message: 'Trajet créé', trajet });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du trajet', error });
  }
};

export const getTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.findAll();
    res.status(200).json(trajets);
  } catch (error) {
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
    res.status(500).json({ message: 'Erreur lors de la récupération du trajet', error });
  }
};

export const updateTrajet = async (req, res) => {
  const { id } = req.params;
  const { Départ, Arrivée, DateHeure, PlacesDisponibles, Prix } = req.body;
  try {
    const trajet = await Trajet.findByPk(id);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    await trajet.update({ Départ, Arrivée, DateHeure, PlacesDisponibles, Prix });
    res.status(200).json({ message: 'Trajet mis à jour' });
  } catch (error) {
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
    res.status(500).json({ message: 'Erreur lors de la suppression du trajet', error });
  }
};