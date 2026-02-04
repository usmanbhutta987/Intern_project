/**
 * Authentication Routes
 * Handles user registration, login, and logout endpoints
 */

import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';

// Create Express router instance
const router = express.Router();

/**
 * POST /api/auth/register
 * User registration endpoint
 * Validates input and creates new user account
 */
router.post('/register', validateRegister, register);

/**
 * POST /api/auth/login
 * User login endpoint
 * Validates credentials and returns JWT token
 */
router.post('/login', validateLogin, login);

/**
 * POST /api/auth/logout
 * User logout endpoint
 * Protected route - requires authentication
 * Both user and admin can logout
 */
router.post('/logout', auth, logout);

export default router;