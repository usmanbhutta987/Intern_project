/**
 * Post Model
 * Defines the schema for user posts/content management
 */

import mongoose from 'mongoose';

/**
 * Post Schema Definition
 * Contains post content, metadata, and relationships
 */
const postSchema = new mongoose.Schema({
  // Post title - required field with trimming
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Post description/content - main body text
  description: {
    type: String,
    required: true
  },
  // Optional image filename - stored locally via multer
  image: {
    type: String,
    default: null
  },
  // Reference to the user who created this post
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Post status - allows admin to disable posts
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true
});

/**
 * Text Index for Search Functionality
 * Enables full-text search on title and description fields
 */
postSchema.index({ title: 'text', description: 'text' });

// Export Post model
export default mongoose.model('Post', postSchema);