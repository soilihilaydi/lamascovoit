import Trajet from '../models/trajetModel.js';

// Créer un nouveau trajet
export const createTrajet = async (req, res) => {
  const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;

  try {
    const newTrajet = await Trajet.create({
      Depart,
      Arrivee,
      DateHeure,
      PlacesDisponibles,
      Prix
    });
    res.status(201).json(newTrajet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les trajets
export const getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.findAll();
    res.status(200).json(trajets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un trajet par ID
export const getTrajetById = async (req, res) => {
  const { id } = req.params;

  try {
    const trajet = await Trajet.findByPk(id);
    if (trajet) {
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ message: 'Trajet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un trajet
export const updateTrajet = async (req, res) => {
  const { id } = req.params;
  const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;

  try {
    const trajet = await Trajet.findByPk(id);
    if (trajet) {
      trajet.Depart = Depart;
      trajet.Arrivee = Arrivee;
      trajet.DateHeure = DateHeure;
      trajet.PlacesDisponibles = PlacesDisponibles;
      trajet.Prix = Prix;
      await trajet.save();
      res.status(200).json(trajet);
    } else {
      res.status(404).json({ message: 'Trajet non trouvé' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un trajet
export const deleteTrajet = async (req, res) => {
  const { id } = req.params;

  try {
    const trajet = await Trajet.findByPk(id);
    if (trajet) {
      await trajet.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ message: 'Trajet non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
