import express from 'express';
import { getUserStats, getMyPosts } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard stats
router.get('/stats', auth, getUserStats);

// Get user's own posts
router.get('/my-posts', auth, getMyPosts);

export default router;