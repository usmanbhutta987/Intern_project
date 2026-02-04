/**
 * Database Configuration
 * MongoDB connection setup using Mongoose
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB with the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log connection error and exit process
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;