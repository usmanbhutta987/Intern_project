/**
 * Post Routes
 * Handles CRUD operations for posts with file upload support
 */

import express from 'express';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/postController.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validatePost } from '../middleware/validation.js';

// Create Express router instance
const router = express.Router();

/**
 * GET /api/posts
 * Get all active posts with search and pagination
 * Public endpoint - no authentication required
 */
router.get('/', getPosts);

/**
 * GET /api/posts/:id
 * Get single post by ID
 * Protected endpoint - requires authentication
 */
router.get('/:id', auth, getPosts);

/**
 * POST /api/posts
 * Create new post with optional image upload
 * Protected endpoint - requires authentication
 * Supports multipart/form-data for file upload
 */
router.post('/', auth, upload.single('image'), validatePost, createPost);

/**
 * PUT /api/posts/:id
 * Update existing post (owner only)
 * Protected endpoint - requires authentication and ownership
 * Supports multipart/form-data for file upload
 */
router.put('/:id', auth, upload.single('image'), updatePost);

/**
 * DELETE /api/posts/:id
 * Delete existing post (owner only)
 * Protected endpoint - requires authentication and ownership
 */
router.delete('/:id', auth, deletePost);

export default router;