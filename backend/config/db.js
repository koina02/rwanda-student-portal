const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection function with retry mechanism
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ Initial MongoDB connection failed:', err.message);
    
    console.log('🔁 Retrying MongoDB connection in 5 seconds...');
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Handle MongoDB disconnections after initial connect
mongoose.connection.on('disconnected', () => {
  console.error('⚡️ MongoDB disconnected. Attempting to reconnect...');
  connectDB(); // Auto-reconnect if connection drops later
});

// Export the connectDB function
module.exports = connectDB;
