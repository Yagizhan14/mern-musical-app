const router = require('express').Router();
const User = require('../models/UserModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/authenticate');

// GET /api/auth/user
// Get user data
// Access private
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password') // Discard the password field.
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

// POST /api/auth/user
// Authenticate user
// Access private
router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Please enter your email and password accordingly!' });

  User.findOne({ email })
    .then(user => {
      if (!user)
        return res.status(400).json({ message: 'User does not exist' });
      if (user.password !== password)
        return res.status(400).json({ message: 'Invalid password!' });
      jwt.sign(
        { id: user.id },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        },
      );
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
