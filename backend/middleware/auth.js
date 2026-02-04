/**
 * Authentication Middleware
 * Handles JWT token verification and user authorization
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token format)
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify JWT token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token payload, exclude password field
    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists and is active
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }

    // Attach user to request object for use in protected routes
    req.user = user;
    next();
  } catch (error) {
    // Handle invalid token errors
    res.status(401).json({ message: 'Invalid token.' });
  }
};

/**
 * Admin Authorization Middleware
 * Ensures user has admin role - must be used after auth middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminAuth = (req, res, next) => {
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

export { auth, adminAuth };