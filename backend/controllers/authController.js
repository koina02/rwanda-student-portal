const User = require('../models/User'); // Import User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token (including name and email in the token payload)
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token, // Send token back with response
            user: { name: user.name, email: user.email } // Send user data (excluding password)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token (including name and email in the token payload)
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token, // Send token back with response
            user: { name: user.name, email: user.email } // Send user data (excluding password)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
