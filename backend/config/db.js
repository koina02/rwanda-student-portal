const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);  // Exit process if MongoDB connection fails
  }
};

module.exports = connectDB;
