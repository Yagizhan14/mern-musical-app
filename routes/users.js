const router = require('express').Router();
const User = require('../models/UserModel');
const Playlist = require('../models/PlaylistModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /api/users
// add a user
// access public
router.post('/', (req, res) => {
  // Get the credentials from body
  const { name, email, password } = req.body;

  // Check the credentials' existence
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: 'Please enter your credentials accordingly.' });

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ message: 'User already exists.' });
    // If no error then register the user to database
    const newUser = new User({
      name,
      email,
      password,
    });

    newUser
      .save()
      .then(user => {
        Playlist.findOne({ userId: user.id })
          .then(playlist => {
            if (!playlist) {
              const newPlaylist = new Playlist({
                songs: [],
                userId: user.id,
              });
              newPlaylist
                .save()
                .then(playlist => {
                  // Create token
                  jwt.sign(
                    { id: user.id },
                    process.env.jwtSecret,
                    { expiresIn: 3600 },
                    (err, token) => {
                      if (err) throw err;
                      res.json({
                        user: {
                          token,
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          password: user.password,
                          playlist,
                        },
                      });
                    },
                  );
                })
                .catch(err => console.log(err.message));
            }
          })
          .catch(err => console.log(err.message));
      })
      .catch(err => res.status(500).json(err.message));
  });
});

module.exports = router;
