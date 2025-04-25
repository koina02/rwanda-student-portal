const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the MongoDB connection function
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from the environment
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

// Export the connectDB function
module.exports = connectDB;
