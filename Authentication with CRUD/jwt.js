const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken };