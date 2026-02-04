/**
 * Input Validation Middleware
 * Defines validation rules for different API endpoints
 */

import { body } from 'express-validator';

/**
 * User Registration Validation Rules
 * Validates name, email, and password fields
 */
const validateRegister = [
  // Name validation - minimum 2 characters, trimmed
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  // Email validation - must be valid email format
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  // Password validation - minimum 6 characters for security
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

/**
 * User Login Validation Rules
 * Validates email and password fields
 */
const validateLogin = [
  // Email validation - must be valid email format
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  
  // Password validation - must not be empty
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Post Creation/Update Validation Rules
 * Validates title and description fields
 */
const validatePost = [
  // Title validation - minimum 3 characters, trimmed
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  
  // Description validation - minimum 10 characters for meaningful content
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
];

export {
  validateRegister,
  validateLogin,
  validatePost
};