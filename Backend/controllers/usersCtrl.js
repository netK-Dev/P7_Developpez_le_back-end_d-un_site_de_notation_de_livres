const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/usersModel');

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new userModel({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  userModel
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: 'Email ou mot de passe incorrect !' });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: 'Email ou mot de passe incorrect !' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  'RANDOM_DEV_KEY', // Provisoire
                  { expiresIn: '24h' }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
