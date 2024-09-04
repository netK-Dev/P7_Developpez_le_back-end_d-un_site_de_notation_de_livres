const mongoose = require('mongoose');

// Schéma pour les ratings
const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant MongoDB unique de l'utilisateur qui a noté le livre
  grade: { type: Number, required: true }, // Note donnée à un livre
});

// Schéma pour les livres
const booksSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Identifiant MongoDB unique de l'utilisateur qui a créé le livre
  title: { type: String, required: true }, // Titre du livre
  author: { type: String, required: true }, // Auteur du livre
  imageUrl: { type: String, required: true }, // Illustration/couverture du livre
  year: { type: Number, required: true }, // Année de publication du livre
  genre: { type: String, required: true }, // Genre du livre
  ratings: [ratingSchema], // Tableau de notes données au livre
  averageRating: { type: Number }, // Note moyenne du livre
});

module.exports = mongoose.model('Book', booksSchema);
