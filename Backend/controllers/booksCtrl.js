const Book = require('../models/booksModel');

// Contrôleur pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find() // Utilisation de Mongoose pour récupérer tous les livres
    .then((books) => res.status(200).json(books)) // Renvoie tous les livres sous forme de JSON
    .catch((error) => res.status(400).json({ error })); // Gère les erreurs
};

// Contrôleur pour ajouter un livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Récupérer l'objet 'book' dans la requête
  delete bookObject._id;
  delete bookObject.userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Récupérer le userId du token d'authentification
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Générer l'URL de l'image
  });

  book
    .save() // Enregistrer le livre dans la base de données
    .then(() => res.status(201).json({ message: 'Livre créé !' }))
    .catch((error) => res.status(400).json({ error }));
};
