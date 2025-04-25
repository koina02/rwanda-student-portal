const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// 🔒 Middleware to check admin role
const restrictToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admins only.', 403));
  }
  next();
};

// 💳 Process Payment (Authenticated users)
router.post(
  '/pay',
  authMiddleware,
  catchAsync(paymentController.processPayment)
);

// 📦 Get Payment Status by Transaction ID (Authenticated users)
router.get(
  '/status/:transactionId',
  authMiddleware,
  catchAsync(paymentController.getPaymentStatus)
);

// 🗃️ Get All Payments (Admin only)
router.get(
  '/all',
  authMiddleware,
  restrictToAdmin,
  catchAsync(paymentController.getAllPayments)
);

module.exports = router;
