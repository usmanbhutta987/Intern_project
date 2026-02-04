/**
 * Post Controller
 * Handles CRUD operations for posts with search and pagination
 */

import Post from '../models/Post.js';
import { validationResult } from 'express-validator';

/**
 * Create New Post Controller
 * Creates a new post with optional image upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPost = async (req, res) => {
  try {
    // Check for validation errors from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    // Get image filename if file was uploaded via multer
    const image = req.file ? req.file.filename : null;

    // Create new post with authenticated user as author
    const post = await Post.create({
      title,
      description,
      image,
      author: req.user._id // From auth middleware
    });

    // Populate author information for response
    await post.populate('author', 'name email');

    // Send success response with created post
    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get Single Post Controller
 * Retrieves a single post by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSinglePost = async (req, res) => {
  try {
    // If ID is provided in params, get single post
    if (req.params.id) {
      const post = await Post.findById(req.params.id)
        .populate('author', 'name email');
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      return res.json({
        success: true,
        post
      });
    }
    
    // Otherwise, get all posts (existing functionality)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // For dashboard stats (high limit), return all posts; otherwise only active posts
    const query = limit >= 1000 ? {} : { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update Post Controller
 * Updates existing post - only by post owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Find post by ID
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if current user is the post author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update post fields if provided
    post.title = title || post.title;
    post.description = description || post.description;
    
    // Update image if new file uploaded
    if (req.file) {
      post.image = req.file.filename;
    }

    // Save updated post
    await post.save();
    
    // Populate author information for response
    await post.populate('author', 'name email');

    // Send success response with updated post
    res.json({
      success: true,
      post
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete Post Controller
 * Deletes existing post - only by post owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePost = async (req, res) => {
  try {
    // Find post by ID
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if current user is the post author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    // Send success response
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createPost,
  getSinglePost as getPosts,
  updatePost,
  deletePost
};