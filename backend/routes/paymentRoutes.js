const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');  // Ensure token is present and valid

// Process Payment (accessible to authenticated users)
router.post('/pay', authMiddleware, paymentController.processPayment);

// Get Payment Status (accessible to authenticated users)
router.get('/status/:transactionId', authMiddleware, paymentController.getPaymentStatus);

// Get All Payments (Admin Only - accessible to admin users)
router.get('/all', authMiddleware, (req, res, next) => {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();  // If admin, proceed to the controller
}, paymentController.getAllPayments);

module.exports = router;
