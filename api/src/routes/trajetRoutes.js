import express from 'express';
import { createTrajet, getTrajets, getTrajet, updateTrajet, deleteTrajet } from '../controllers/trajetController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Trajet:
 *       type: object
 *       required:
 *         - Départ
 *         - Arrivée
 *         - DateHeure
 *         - PlacesDisponibles
 *         - Prix
 *       properties:
 *         idTrajet:
 *           type: integer
 *           description: L'identifiant unique du trajet
 *           example: 1
 *         Départ:
 *           type: string
 *           description: Le lieu de départ du trajet
 *           example: "Lamastre"
 *         Arrivée:
 *           type: string
 *           description: Le lieu d'arrivée du trajet
 *           example: "Valence"
 *         DateHeure:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure de départ du trajet
 *           example: "2024-09-14T10:00:00Z"
 *         PlacesDisponibles:
 *           type: integer
 *           description: Le nombre de places disponibles pour ce trajet
 *           minimum: 1
 *           maximum: 8
 *           example: 3
 *         Prix:
 *           type: number
 *           description: Le prix du trajet par personne
 *           minimum: 0
 *           example: 5.50
 *     Utilisateur:
 *       type: object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - motDePasse
 *       properties:
 *         idUtilisateur:
 *           type: integer
 *           description: L'identifiant unique de l'utilisateur
 *           example: 1
 *         nom:
 *           type: string
 *           description: Le nom de l'utilisateur
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           description: Le prénom de l'utilisateur
 *           example: "Jean"
 *         email:
 *           type: string
 *           format: email
 *           description: L'adresse email de l'utilisateur
 *           example: "jean.dupont@example.com"
 *         motDePasse:
 *           type: string
 *           format: password
 *           description: Le mot de passe de l'utilisateur
 *           example: "motDePasseSecurise123"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Gestion des trajets
 */


/**
 * @swagger
 * /api/trajets:
 *   post:
 *     summary: Crée un nouveau trajet
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trajet'
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

router.post('/', verifyToken, createTrajet);
/**
 * @swagger
 * /api/trajets:
 *   get:
 *     summary: Récupère tous les trajets
 *     tags: [Trajets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page pour la pagination (par défaut 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de trajets par page (par défaut 10)
 *     responses:
 *       200:
 *         description: Liste de tous les trajets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trajets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trajet'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */

router.get('/', getTrajets);
/**
 * @swagger
 * /api/trajets/{id}:
 *   get:
 *     summary: Récupère un trajet par son ID
 *     tags: [Trajets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Détails du trajet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       404:
 *         description: Trajet non trouvé
 */
router.get('/:id', getTrajet);
/**
 * @swagger
 * /api/trajets/{id}:
 *   put:
 *     summary: Met à jour un trajet
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trajet'
 *     responses:
 *       200:
 *         description: Trajet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trajet'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Trajet non trouvé
 */
router.put('/:id', verifyToken, updateTrajet);

/**
 * @swagger
 * /api/trajets/{id}:
 *   delete:
 *     summary: Supprime un trajet
 *     tags: [Trajets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Trajet supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Trajet non trouvé
 */
router.delete('/:id', verifyToken, deleteTrajet);





router.delete('/:id', verifyToken, deleteTrajet);




export default router;


