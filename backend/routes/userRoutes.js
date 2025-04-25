const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;  // Role field is added here
  try {
    // Validate role
    if (!['student', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Allowed roles are student or instructor.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,  // Save the role to the user
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User Login Route (JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },  // Include the role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
