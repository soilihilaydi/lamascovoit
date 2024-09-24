import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  deleteProfile, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/utilisateurController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/utilisateurs/register:
 *   post:
 *     summary: Inscrit un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/register', register);

/**
 * @swagger
 * /api/utilisateurs/login:
 *   post:
 *     summary: Connecte un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', login);

/**
 * @swagger
 * /api/utilisateurs/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Non autorisé
 */
router.get('/profile', verifyToken, getProfile);

/**
 * @swagger
 * /api/utilisateurs/profile:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.put('/profile', verifyToken, updateProfile);

/**
 * @swagger
 * /api/utilisateurs/profile:
 *   delete:
 *     summary: Supprime le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil supprimé avec succès
 *       401:
 *         description: Non autorisé
 */
router.delete('/profile', verifyToken, deleteProfile);

/**
 * @swagger
 * /api/utilisateurs:
 *   get:
 *     summary: Récupère tous les utilisateurs (admin seulement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.get('/', verifyToken, verifyAdmin, getAllUsers);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', verifyToken, getUserById);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   put:
 *     summary: Met à jour un utilisateur par son ID (admin seulement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.put('/:id', verifyToken, verifyAdmin, updateUser);

/**
 * @swagger
 * /api/utilisateurs/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par son ID (admin seulement)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;

