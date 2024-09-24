import express from 'express';
import { createEvaluation, getEvaluations, getEvaluationById, updateEvaluation, deleteEvaluation } from '../controllers/evaluationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       required:
 *         - Note
 *         - idUtilisateur
 *         - idTrajet
 *       properties:
 *         idEvaluation:
 *           type: integer
 *           description: L'identifiant unique de l'évaluation
 *         Note:
 *           type: integer
 *           description: La note de l'évaluation
 *         Commentaire:
 *           type: string
 *           description: Le commentaire de l'évaluation
 *         idUtilisateur:
 *           type: integer
 *           description: L'ID de l'utilisateur qui a laissé l'évaluation
 *         idTrajet:
 *           type: integer
 *           description: L'ID du trajet évalué
 */

/**
 * @swagger
 * /api/evaluations:
 *   post:
 *     summary: Crée une nouvelle évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluation'
 *     responses:
 *       201:
 *         description: Évaluation créée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifyToken, createEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Récupère toutes les évaluations
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les évaluations
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifyToken, getEvaluations);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   get:
 *     summary: Récupère une évaluation par son ID
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'évaluation
 *     responses:
 *       200:
 *         description: Évaluation récupérée avec succès
 *       404:
 *         description: Évaluation non trouvée
 */
router.get('/:id', verifyToken, getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   put:
 *     summary: Met à jour une évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
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
 *       404:
 *         description: Évaluation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifyToken, updateEvaluation);

/**
 * @swagger
 * /api/evaluations/{id}:
 *   delete:
 *     summary: Supprime une évaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
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
router.delete('/:id', verifyToken, deleteEvaluation);

export default router;
