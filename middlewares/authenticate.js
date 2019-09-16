require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check for token existence
  if (!token)
    return res.status(401).json({ message: 'No token, authorization failed.' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
