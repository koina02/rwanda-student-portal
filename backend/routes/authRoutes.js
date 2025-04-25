const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

// 🔐 Register
router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return next(new AppError('User already exists', 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
    });
  })
);

// 🔑 Login
router.post(
  '/login',
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('User not found', 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError('Invalid credentials', 400));

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: 'success',
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  })
);

// 👤 Get User Profile (Protected)
router.get(
  '/profile',
  authMiddleware,
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  })
);

// 🛡️ Admin Route
router.get(
  '/admin',
  authMiddleware,
  catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
      return next(new AppError('Access denied: Admins only', 403));
    }

    res.status(200).json({
      status: 'success',
      message: 'Welcome, Admin!',
    });
  })
);

module.exports = router;
