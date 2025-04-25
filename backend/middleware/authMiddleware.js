const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;
    
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('❌ JWT Auth Error:', error.message);

    const message = error.name === 'TokenExpiredError' 
      ? 'Session expired. Please log in again.' 
      : 'Invalid or corrupted token.';

    return res.status(401).json({ message });
  }
};

module.exports = authMiddleware;