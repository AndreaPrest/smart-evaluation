const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = (req, res, next) => {
    // Get the JWT from the request headers
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: 'Access denied' })
    }

    try {
        // Verify the JWT and get the user's information
        let rs = jwt.verify(token, process.env.JWT_KEY)
        next()
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' })
    }
}