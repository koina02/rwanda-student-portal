// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Security headers
const rateLimit = require('express-rate-limit'); // Rate limiting
const mongoose = require('mongoose'); // MongoDB
const jwt = require('jsonwebtoken'); // JWT
const bcrypt = require('bcryptjs'); // bcrypt for password hashing
const connectDB = require('./config/db'); // DB connection

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);  // Exit the process if DB connection fails
  });

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Set security headers

// Rate limiter (prevents abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// JWT Authentication Middleware
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in the request object
    next();
  } catch (error) {
    const errorMessage = error.name === 'TokenExpiredError' 
      ? 'Token has expired, please log in again'
      : 'Token is not valid';
    console.error(`❌ JWT Error: ${error.message}`);
    res.status(401).json({ message: errorMessage });
  }
};

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const courseRoutes = require('./routes/courseRoutes'); // Course management routes
const paymentRoutes = require('./routes/paymentRoutes'); // Payment processing routes

// Use routes in the app
app.use('/api/auth', authRoutes);
app.use('/api/courses', protect, courseRoutes); // Protecting course routes with JWT authentication
app.use('/api/payments', protect, paymentRoutes); // Protecting payment routes with JWT authentication

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 F&R Education Platform Backend Running');
});

// Error Handling Middleware (General Errors)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Handle unhandled promise rejections (important for production)
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);  // Exit the process
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}...`);
});
