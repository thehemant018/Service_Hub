// middleware/fetchprofs.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'TumseNaHoPayega';
const Professional = require('../models/professional');

const fetchprofsfororder = async (req, res, next) => {
    // Get the token from the header
    const token = req.header('auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Access Denied' });
    }

    try {
        // Verify the token
        const data = jwt.verify(token, JWT_SECRET);

        // Find the professional by ID from the token data
        const professional = await Professional.findById(data.professional.id);

        // Check if professional exists
        if (!professional) {
            return res.status(401).json({ error: 'Professional not found' });
        }

        // Attach the professional to the request object
        req.professional = professional;

        // Continue with the next middleware or route handler
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ error: 'Invalid Token' });
    }
};

module.exports = fetchprofsfororder;
