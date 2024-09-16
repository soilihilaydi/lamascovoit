import express from 'express';
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../controllers/evaluationController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       required:
 *         - idUtilisateur
 *         - idTrajet
 *         - note
 *         - commentaire
 *       properties:
 *         idEvaluation:
 *           type: integer
 *           description: L'identifiant unique de l'évaluation
 *         idUtilisateur:
 *           type: integer
 *           description: L'identifiant de l'utilisateur qui a fait l'évaluation
 *         idTrajet:
 *           type: integer
 *           description: L'identifiant du trajet évalué
 *         note:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: La note donnée (de 1 à 5)
 *         commentaire:
 *           type: string
 *           description: Le commentaire de l'évaluation
 *         dateEvaluation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure de l'évaluation
 */

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Gestion des évaluations
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Crée une nouvelle évaluation
 *     tags: [Evaluations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluation'
 *     responses:
 *       201:
 *         description: Évaluation créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/api/evaluations', createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Récupère toutes les évaluations
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Liste de toutes les évaluations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 */
router.get('/api/evaluations', getEvaluations);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Récupère une évaluation par son ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'évaluation
 *     responses:
 *       200:
 *         description: Détails de l'évaluation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       404:
 *         description: Évaluation non trouvée
 */
router.get('/api/evaluations/:id', getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Met à jour une évaluation
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'évaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluation'
 *     responses:
 *       200:
 *         description: Évaluation mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Évaluation non trouvée
 */
router.put('/api/evaluations/:id', updateEvaluation);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Supprime une évaluation
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'évaluation
 *     responses:
 *       200:
 *         description: Évaluation supprimée avec succès
 *       404:
 *         description: Évaluation non trouvée
 */
router.delete('/api/evaluations/:id', deleteEvaluation);

export default router;

