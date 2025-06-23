require('dotenv').config()
const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    // Get token from header (usually 'Bearer <token>')
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer'

    if (!token) {
        return res.status(401).json({ message: 'Token format is incorrect' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = decoded; // decoded will contain { id, username } from jwt.sign()
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error('Failed to authenticate token:', error);
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

module.exports = authMiddleware;