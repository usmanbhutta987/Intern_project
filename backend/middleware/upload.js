/**
 * File Upload Middleware
 * Handles image upload using Multer for local storage
 */

import multer from 'multer';
import path from 'path';

/**
 * Multer Storage Configuration
 * Defines where and how uploaded files are stored
 */
const storage = multer.diskStorage({
  // Set destination folder for uploaded files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Generate unique filename to prevent conflicts
  filename: (req, file, cb) => {
    // Create filename: timestamp-randomnumber.extension
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

/**
 * File Filter Function
 * Only allows image files to be uploaded
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Check if file is an image type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};

/**
 * Multer Upload Configuration
 * Combines storage, file filter, and size limits
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

export default upload;