import express from 'express';
import { createReservation, getReservations, getReservationById, updateReservation, deleteReservation } from '../controllers/reservationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - idUtilisateur
 *         - idTrajet
 *         - nombrePlaces
 *       properties:
 *         idReservation:
 *           type: integer
 *           description: L'identifiant unique de la réservation
 *         idUtilisateur:
 *           type: integer
 *           description: L'identifiant de l'utilisateur qui fait la réservation
 *         idTrajet:
 *           type: integer
 *           description: L'identifiant du trajet réservé
 *         nombrePlaces:
 *           type: integer
 *           description: Le nombre de places réservées
 *         dateReservation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure de la réservation
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/', verifyToken, createReservation);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Récupère toutes les réservations de l'utilisateur connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Non autorisé
 */
router.get('/', verifyToken, getReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Récupère une réservation par son ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de la réservation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', verifyToken, getReservationById);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.put('/:id', verifyToken, updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', verifyToken, deleteReservation);

export default router;
