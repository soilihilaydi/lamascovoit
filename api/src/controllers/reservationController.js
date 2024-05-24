import Reservation from '../models/reservationModel.js';

export const createReservation = async (req, res) => {
  try {
    const { idUtilisateur, idTrajet, DateReservation } = req.body;
    const reservation = await Reservation.create({ idUtilisateur, idTrajet, DateReservation });
    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la création de la réservation', error });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations', error });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation', error });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    const { idUtilisateur, idTrajet, DateReservation } = req.body;
    await reservation.update({ idUtilisateur, idTrajet, DateReservation });
    res.status(200).json({ message: 'Réservation mise à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation', error });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    await reservation.destroy();
    res.status(200).json({ message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la suppression de la réservation', error });
  }
};