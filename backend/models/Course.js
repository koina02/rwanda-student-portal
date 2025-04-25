const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: [String], // Array of content (e.g., video links, PDFs)
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true, // E.g., "Technology", "Business"
    },
    duration: {
      type: String, // You can specify this as "1 hour", "3 days", "4 weeks", etc.
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0, // Rating can be from 1 to 5
    },
    enrollmentCount: {
      type: Number,
      default: 0, // Track how many students have enrolled
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Course', courseSchema);
