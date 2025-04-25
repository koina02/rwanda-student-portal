const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference to the Course model
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'], // Adding validation for positive amount
      validate: {
        validator: Number.isFinite,
        message: 'Amount must be a number'
      }
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'mobile_money', 'paypal', 'bank_transfer'],
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true // Make sure this is indexed for faster queries
    },
    status: {
      type: String,
      enum: ['pending', 'successful', 'failed'],
      default: 'pending'
    },
    paymentDetails: {
      type: Object, // Optional field to store detailed payment data (for mobile money, PayPal, etc.)
      required: false
    },
    payerName: {
      type: String, // Optional: Store payer's name if available (for credit card, mobile money, etc.)
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add index for commonly queried fields
paymentSchema.index({ user: 1, course: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
