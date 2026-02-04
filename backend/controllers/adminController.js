/**
 * Admin Controller
 * Handles administrative operations for users and posts management
 */

import User from '../models/User.js';
import Post from '../models/Post.js';

/**
 * Get All Users Controller
 * Retrieves all users for admin management - Admin only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Build query object
    const query = {};
    
    // Add text search if search term provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Find all users, exclude password field, sort by newest first
    const users = await User.find(query)
      .select('-password') // Exclude sensitive password data
      .sort({ createdAt: -1 })
      .limit(limit * 1) // Limit results per page
      .skip((page - 1) * limit); // Skip results for pagination

    // Get total count for pagination metadata
    const total = await User.countDocuments(query);

    // Send success response with users list and pagination
    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get All Posts Controller
 * Retrieves all posts (including inactive) for admin management - Admin only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPosts = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Build query object
    const query = {};
    
    // Add text search if search term provided
    if (search) {
      query.$text = { $search: search };
    }

    // Find all posts (including inactive ones for admin view)
    const posts = await Post.find(query)
      .populate('author', 'name email') // Include author information
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit * 1) // Limit results per page
      .skip((page - 1) * limit); // Skip results for pagination

    // Get total count for pagination metadata
    const total = await Post.countDocuments(query);

    // Send success response with posts list and pagination
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
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Toggle Post Status Controller
 * Activates or deactivates a post - Admin only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const togglePostStatus = async (req, res) => {
  try {
    // Find post by ID
    const post = await Post.findById(req.params.id);
    
    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Toggle the isActive status
    post.isActive = !post.isActive;
    await post.save();

    // Send success response with updated status
    res.json({
      success: true,
      message: `Post ${post.isActive ? 'activated' : 'deactivated'} successfully`,
      post
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete Post (Admin) Controller
 * Permanently deletes any post - Admin only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePostAdmin = async (req, res) => {
  try {
    // Find and delete post by ID
    const post = await Post.findByIdAndDelete(req.params.id);
    
    // Check if post existed
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

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
  getAllUsers,
  getAllPosts,
  togglePostStatus,
  deletePostAdmin
};