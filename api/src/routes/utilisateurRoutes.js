import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/utilisateurController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.delete('/profile/delete', authMiddleware, deleteProfile);

export default router;