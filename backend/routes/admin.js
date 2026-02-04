/**
 * Admin Routes
 * Handles administrative operations for users and posts management
 * All routes require authentication and admin role
 */

import express from 'express';
import { getAllUsers, getAllPosts, togglePostStatus, deletePostAdmin } from '../controllers/adminController.js';
import { auth, adminAuth } from '../middleware/auth.js';

// Create Express router instance
const router = express.Router();

/**
 * Apply authentication and admin authorization to all routes
 * All admin routes require valid JWT token and admin role
 */
router.use(auth, adminAuth);

/**
 * GET /api/admin/users
 * Get all users for admin management
 * Returns list of all users with their details (excluding passwords)
 */
router.get('/users', getAllUsers);

/**
 * GET /api/admin/posts
 * Get all posts for admin management
 * Returns list of all posts including inactive ones
 */
router.get('/posts', getAllPosts);

/**
 * PATCH /api/admin/posts/:id/toggle
 * Toggle post active status (activate/deactivate)
 * Allows admin to control post visibility
 */
router.patch('/posts/:id/toggle', togglePostStatus);

/**
 * DELETE /api/admin/posts/:id
 * Permanently delete any post
 * Admin can delete any post regardless of ownership
 */
router.delete('/posts/:id', deletePostAdmin);

export default router;