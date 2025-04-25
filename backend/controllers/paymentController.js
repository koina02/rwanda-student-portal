const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');

// Process Payment
exports.processPayment = async (req, res) => {
  try {
    const { userId, courseId, amount, paymentMethod, transactionId } = req.body;

    // Validate required fields
    if (!userId || !courseId || !amount || !paymentMethod || !transactionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify user and course exist
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ message: 'User or Course not found' });
    }

    // Save payment to database
    const payment = new Payment({
      user: userId,
      course: courseId,
      amount,
      paymentMethod,
      transactionId,
      status: 'pending'
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment initiated successfully',
      payment: {
        userId: payment.user,
        courseId: payment.course,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Payment Error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Payment Status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Payment.findOne({ transactionId }).populate('user', 'name email').populate('course', 'title');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      status: payment.status,
      payment: {
        user: payment.user.name,
        email: payment.user.email,
        course: payment.course.title,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Payment Status Error:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Payments for Admin
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .exec(); // .exec() is used here to ensure that the query runs immediately

    res.json(payments.map(payment => ({
      user: payment.user.name,
      email: payment.user.email,
      course: payment.course.title,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      status: payment.status,
      createdAt: payment.createdAt
    })));
  } catch (error) {
    console.error('Fetch Payments Error:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

