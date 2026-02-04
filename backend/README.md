# BlogSpace Backend API Testing Guide

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Testing Guide](#testing-guide)
- [Authentication](#authentication)
- [File Upload Testing](#file-upload-testing)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Project Overview

**BlogSpace** is a full-stack MERN blog application with the following features:
- User authentication (Register/Login/Logout)
- Post management (CRUD operations)
- File upload for post images
- Admin panel for user and post management
- Role-based access control
- Search functionality with text indexing

### Tech Stack
- **Backend**: Node.js, Express.js (ES6 Modules)
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT (7 days expiry)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs (12 salt rounds)

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- Postman/Thunder Client for API testing

### 1. Navigate to Backend Directory
```bash
cd "c:\Next.js\Intern Project\backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Already Configured)
Your `.env` file contains:
```env
PORT=5000
MONGODB_URI=mongodb+srv://muhammadayoubbhutta:ayoubbhutta%40111@cluster0.8do7hks.mongodb.net/mern-project?retryWrites=true&w=majority
JWT_SECRET=thisiadthaljlajfkldskjfisd
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Verify Server is Running
Open browser and visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "message": "Server is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🔗 API Endpoints

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. User Logout
```http
POST /api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Post Endpoints

#### 4. Get All Posts (Public)
```http
GET /api/posts
# Query parameters:
# ?page=1&limit=10&search=keyword
```

**Response (200):**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "title": "My Blog Post",
      "description": "Post content here...",
      "image": "1770102316881-383401134.jpg",
      "isActive": true,
      "author": {
        "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### 5. Get Single Post
```http
GET /api/posts/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "post": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "My Blog Post",
    "description": "Post content here...",
    "image": "1770102316881-383401134.jpg",
    "isActive": true,
    "author": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 6. Create New Post
```http
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

# Form data:
title: "My New Post"
description: "Post content here..."
image: [FILE] (optional)
```

**Response (201):**
```json
{
  "success": true,
  "post": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "My New Post",
    "description": "Post content here...",
    "image": "1770102316881-383401134.jpg",
    "isActive": true,
    "author": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 7. Update Post (Owner Only)
```http
PUT /api/posts/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

# Form data:
title: "Updated Post Title"
description: "Updated content..."
image: [FILE] (optional)
```

#### 8. Delete Post (Owner Only)
```http
DELETE /api/posts/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### User Dashboard Endpoints

#### 9. Get User Stats
```http
GET /api/user/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalPosts": 15,
    "publishedPosts": 10,
    "draftPosts": 5
  }
}
```

#### 10. Get User's Posts
```http
GET /api/user/my-posts
Authorization: Bearer YOUR_JWT_TOKEN
# Query parameters: ?page=1&limit=10&search=keyword
```

**Response (200):**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "title": "My Post",
      "description": "Content...",
      "image": "1770102316881-383401134.jpg",
      "isActive": true,
      "author": {
        "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### Admin Endpoints (Admin Role Required)

#### 11. Get All Users
```http
GET /api/admin/users
Authorization: Bearer ADMIN_JWT_TOKEN
# Query parameters: ?page=1&limit=10&search=keyword
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### 12. Get All Posts (Admin)
```http
GET /api/admin/posts
Authorization: Bearer ADMIN_JWT_TOKEN
# Query parameters: ?page=1&limit=10&search=keyword
```

#### 13. Toggle Post Status
```http
PATCH /api/admin/posts/:id/toggle
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Post activated successfully",
  "post": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "Post Title",
    "isActive": true
  }
}
```

#### 14. Delete Post (Admin)
```http
DELETE /api/admin/posts/:id
Authorization: Bearer ADMIN_JWT_TOKEN
```

---

## 🧪 Testing Guide

### Step 1: Test Server Health
```bash
curl http://localhost:5000/api/health
```

### Step 2: Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Step 3: Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the JWT token from the response!**

### Step 4: Test Protected Endpoints
```bash
# Get user stats
curl -X GET http://localhost:5000/api/user/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get user posts
curl -X GET http://localhost:5000/api/user/my-posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 5: Test Post Creation
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Test Post" \
  -F "description=This is a test post content" \
  -F "image=@/path/to/your/image.jpg"
```

### Step 6: Test Public Endpoints
```bash
# Get all posts (public)
curl -X GET "http://localhost:5000/api/posts?page=1&limit=5"

# Search posts
curl -X GET "http://localhost:5000/api/posts?search=test"
```

---

## 🔐 Authentication

### JWT Token Details
- **Expiry**: 7 days
- **Format**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Payload**: Contains user ID for database queries

### Creating Admin User
1. Register a normal user first
2. Update role in MongoDB:
```javascript
// In MongoDB Compass or shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📁 File Upload Testing

### Supported Formats
- All image formats (handled by multer)
- Files stored in `/uploads` directory
- Filename format: `timestamp-randomnumber.extension`

### Testing with Postman
1. Set method to `POST`
2. URL: `http://localhost:5000/api/posts`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body: Select `form-data`
5. Add fields:
   - `title` (text): "My Post"
   - `description` (text): "Post content"
   - `image` (file): Select image file

### Accessing Uploaded Images
```
http://localhost:5000/uploads/1770102316881-383401134.jpg
```

---

## ❌ Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Validation Error Format
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Server Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

#### 2. Database Connection Error
- MongoDB Atlas is already configured
- Check internet connection
- Verify MongoDB Atlas cluster is running

#### 3. JWT Token Issues
- Token expires in 7 days
- Ensure format: `Bearer <token>`
- Check JWT_SECRET in .env

#### 4. File Upload Issues
- Check if `uploads` folder exists
- Verify Content-Type: `multipart/form-data`
- Ensure image file is selected

---

## 📊 Testing Checklist

### Authentication Tests
- [ ] Register new user with valid data
- [ ] Register with duplicate email (should fail)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Logout with valid token

### Post Management Tests
- [ ] Create post without image
- [ ] Create post with image upload
- [ ] Get all posts (public)
- [ ] Get single post by ID
- [ ] Update own post
- [ ] Try to update other user's post (should fail)
- [ ] Delete own post
- [ ] Try to delete other user's post (should fail)
- [ ] Search posts with keyword

### User Dashboard Tests
- [ ] Get user statistics
- [ ] Get user's own posts
- [ ] Test pagination on user posts
- [ ] Search user's posts

### Admin Tests (if admin user exists)
- [ ] Get all users with pagination
- [ ] Search users by name/email
- [ ] Get all posts (including inactive)
- [ ] Toggle post status (activate/deactivate)
- [ ] Delete any post as admin
- [ ] Access admin routes with regular user (should fail)

### File Upload Tests
- [ ] Upload image with post creation
- [ ] Update post with new image
- [ ] Access uploaded image via URL
- [ ] Create post without image

---

## 🚀 Quick Test Commands

```bash
# Start server
npm run dev

# Test health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get posts (public)
curl http://localhost:5000/api/posts
```

---

## 📝 Important Notes

- **Database**: MongoDB Atlas (cloud-hosted)
- **JWT Expiry**: 7 days
- **Password Hashing**: bcryptjs with 12 salt rounds
- **File Storage**: Local `/uploads` directory
- **Search**: Full-text search on title and description
- **Timestamps**: Automatic createdAt and updatedAt
- **Image Access**: `http://localhost:5000/uploads/filename`
- **Admin Creation**: Manual role update in database

---

This README provides complete testing instructions for your BlogSpace backend API based on the actual implementation.