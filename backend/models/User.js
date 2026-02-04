/**
 * User Model
 * Defines the schema for user authentication and authorization
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition
 * Contains user information, authentication data, and role management
 */
const userSchema = new mongoose.Schema({
  // User's full name - required field with trimming
  name: {
    type: String,
    required: true,
    trim: true
  },
  // User's email - unique identifier, converted to lowercase
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // User's password - minimum 6 characters, will be hashed
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // User role - either 'user' or 'admin', defaults to 'user'
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Account status - allows admin to disable users
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

/**
 * Pre-save middleware
 * Hash password before saving to database if password is modified
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with salt rounds of 12 for security
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method to compare passwords
 * Used during login to verify user credentials
 * @param {string} password - Plain text password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Export User model
export default mongoose.model('User', userSchema);