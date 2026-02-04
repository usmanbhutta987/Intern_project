/**
 * Main Server File
 * Express.js server setup with middleware, routes, and error handling
 */

// Load environment variables from .env file
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// Import route modules
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application instance
const app = express();

// Connect to MongoDB database
connectDB();

/**
 * Middleware Configuration
 */

// Enable Cross-Origin Resource Sharing for frontend communication
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory (for image access)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes Configuration
 */

// Authentication routes - /api/auth/*
app.use('/api/auth', authRoutes);

// Post management routes - /api/posts/*
app.use('/api/posts', postRoutes);

// Admin panel routes - /api/admin/*
app.use('/api/admin', adminRoutes);

// User dashboard routes - /api/user/*
app.use('/api/user', userRoutes);

/**
 * Health Check Endpoint
 * Simple endpoint to verify server is running
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Error Handling Middleware
 * Catches and handles all server errors
 */
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

/**
 * 404 Handler
 * Handles requests to non-existent routes
 */
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

/**
 * Start Server
 * Listen on specified port from environment or default to 5000
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});