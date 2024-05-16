import Trajet from '../../src/models/trajetModel.js';

// Publier un nouveau trajet
export const createTrajet = async (req, res) => {
  try {
    const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;
    console.log('Données du trajet reçues :', req.body);

    const trajet = await Trajet.create({
      Depart,
      Arrivee,
      DateHeure,
      PlacesDisponibles,
      Prix
    });

    console.log('Trajet créé :', trajet);
    res.status(201).json(trajet);
  } catch (error) {
    console.error('Erreur lors de la création du trajet :', error);
    res.status(400).json({ message: error.message });
  }
};

// Lister les trajets disponibles
export const getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.findAll();
    console.log('Trajets récupérés :', trajets);
    res.json(trajets);
  } catch (error) {
    console.error('Erreur lors de la récupération des trajets :', error);
    res.status(500).json({ message: error.message });
  }
};

// Détails d'un trajet
export const getTrajetById = async (req, res) => {
  try {
    const trajet = await Trajet.findByPk(req.params.id);
    console.log('Trajet récupéré :', trajet);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    res.json(trajet);
  } catch (error) {
    console.error('Erreur lors de la récupération du trajet :', error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un trajet
export const updateTrajet = async (req, res) => {
  try {
    const { Depart, Arrivee, DateHeure, PlacesDisponibles, Prix } = req.body;

    const [updatedRows, updatedTrajet] = await Trajet.update(
      {
        Depart: Depart,
        Arrivee: Arrivee,
        DateHeure: DateHeure,
        PlacesDisponibles: PlacesDisponibles,
        Prix: Prix
      },
      {
        where: { idTrajet: req.params.idTrajet },
        returning: true
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    res.status(200).json(updatedTrajet[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du trajet :', error);
    res.status(500).json({ message: error.message });
  }
};


// Supprimer un trajet
export const deleteTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findByPk(req.params.idTrajet);
    if (!trajet) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    await Trajet.destroy({ where: { idTrajet: req.params.idTrajet } });
    res.status(200).json({ message: 'Trajet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du trajet :', error);
    res.status(500).json({ message: error.message });
  }
};
