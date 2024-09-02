const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Adresse e-mail de l'utilisateur, doit être unique
  password: { type: String, required: true }, // Mot de passe haché de l'utilisateur
});

// Utilisation de 'mongoose-unique-validator'
userSchema.plugin(uniqueValidator);

// Exporter le modèle
module.exports = mongoose.model('User', userSchema);
