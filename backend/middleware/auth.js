const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token starts with 'Bearer ' and extract the actual token
    if (!token.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Invalid token format. Ensure the token is prefixed with "Bearer".' });
    }

    // Get the actual token after "Bearer "
    const actualToken = token.split(' ')[1];

    try {
        // Decode and verify the token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle errors from invalid or expired tokens
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }

        // Handle other errors such as invalid token
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

