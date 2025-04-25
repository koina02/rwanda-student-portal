const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email regex validation
      index: true // Index for faster search by email
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Optional: Set minimum password length
    },
    role: {
      type: String,
      enum: ['student', 'instructor'],
      default: 'student',
    },
    name: {
      type: String,
      required: true, // Assuming all users should have a name
    },
    profilePicture: {
      type: String, // Optional field for the user's profile picture (URL to the image)
      required: false
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// 🔹 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

