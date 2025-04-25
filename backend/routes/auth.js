const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./userRoutes');  // Assuming userRoutes.js is your routes file
const AppError = require('../utils/AppError');
const globalErrorHandler = require('../utils/globalErrorHandler');

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());  // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// Connect to DB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.log('Database connection error: ', err));

// Routes
app.use('/api/auth', userRoutes);  // Register routes

// Handle unknown routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
