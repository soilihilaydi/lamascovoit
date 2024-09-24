import Reservation from '../models/reservationModel.js';

export const createReservation = async (req, res) => {
  try {
    const { idUtilisateur, idTrajet, DateReservation } = req.body;
    const reservation = await Reservation.create({ idUtilisateur, idTrajet, DateReservation });
    res.status(201).json({ message: 'Reservation creee', reservation });
  } catch (error) {
    console.error('Erreur lors de la creation de la reservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la creation de la reservation', error });
  }
};

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la recuperation des reservations:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la recuperation des reservations', error });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation non trouvee' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Erreur lors de la recuperation de la reservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la recuperation de la reservation', error });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation non trouvee' });
    }
    const { idUtilisateur, idTrajet, DateReservation } = req.body;
    await reservation.update({ idUtilisateur, idTrajet, DateReservation });
    res.status(200).json({ message: 'Reservation mise a jour' });
  } catch (error) {
    console.error('Erreur lors de la mise a jour de la reservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la mise a jour de la reservation', error });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation non trouvee' });
    }
    await reservation.destroy();
    res.status(200).json({ message: 'Reservation supprimee' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la reservation:', error); // Ajoutez ce log
    res.status(500).json({ message: 'Erreur lors de la suppression de la reservation', error });
  }
};
