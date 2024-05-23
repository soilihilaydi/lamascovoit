import express from 'express';
import { createReservation, getReservations, getReservationById, updateReservation, deleteReservation } from '../controllers/reservationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createReservation);
router.get('/', verifyToken, getReservations);
router.get('/:id', verifyToken, getReservationById);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, deleteReservation);

export default router;
