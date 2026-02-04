/**
 * Authentication Controller
 * Handles user registration and login functionality
 */

import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

/**
 * Generate JWT Token
 * Creates a signed JWT token with user ID
 * @param {string} id - User ID to include in token
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * User Registration Controller
 * Creates new user account with encrypted password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    // Check for validation errors from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({ name, email, password });
    
    // Generate JWT token for immediate login
    const token = generateToken(user._id);

    // Send success response with token and user data
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * User Login Controller
 * Authenticates user and returns JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    // Check for validation errors from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email and check if account is active
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated session
    const token = generateToken(user._id);

    // Send success response with token and user data
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * User Logout Controller
 * Handles user logout (mainly client-side token removal)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = async (req, res) => {
  try {
    // In JWT-based auth, logout is mainly handled on client-side
    // Server just confirms the logout action
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { register, login, logout };