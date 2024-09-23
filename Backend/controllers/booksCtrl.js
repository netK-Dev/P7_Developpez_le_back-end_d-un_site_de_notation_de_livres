const fs = require('fs');
const Book = require('../models/booksModel');

// Contrôleur pour récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find() // Utilisation de Mongoose pour récupérer tous les livres
    .then((books) => res.status(200).json(books)) // Renvoie tous les livres sous forme de JSON
    .catch((error) => res.status(400).json({ error })); // Gère les erreurs
};
//

// Contrôleur pour récupérer un livre par son ID
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id }) // Utiliser l'ID depuis les paramètres de l'URL
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' }); // Si le livre n'existe pas
      }
      res.status(200).json(book); // Si le livre est trouvé, le renvoyer en JSON
    })
    .catch((error) => res.status(400).json({ error })); // Gérer les erreurs possibles
};
//

// Contrôleur pour ajouter un livre
exports.createBook = (req, res) => {
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
//

// Contrôleur pour supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      // Vérifie si l'utilisateur a le droit de supprimer le livre
      if (book.userId !== req.auth.userId) {
        return res
          .status(401)
          .json({ message: 'Non autorisé à supprimer ce livre !' });
      }

      const filename = book.imageUrl.split('/images/')[1];

      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image:", err); // Debug
          return res.status(500).json({ error: err });
        }

        // Supprimer le livre de la base de données
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch((error) => {
            console.error('Erreur lors de la suppression du livre:', error); // Debug
            res.status(500).json({ error });
          });
      });
    })
    .catch((error) => {
      console.error('Erreur lors de la recherche du livre:', error); // Debug
      res.status(500).json({ error });
    });
};
//

// Contrôleur pour modifier un livre
exports.modifyBook = (req, res) => {
  Book.findOne({ _id: req.params.id }) // Trouver le livre par son ID
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      // Vérifier si l'utilisateur est bien l'auteur du livre
      if (book.userId !== req.auth.userId) {
        return res
          .status(401)
          .json({ message: 'Non autorisé à modifier ce livre !' });
      }

      // Préparer l'objet livre à mettre à jour
      const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book), // Si une nouvelle image est fournie
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
        : { ...req.body }; // Sinon, garder les autres champs

      // Supprimer l'ancienne image si une nouvelle est fournie
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne image:",
              err
            );
          }
        });
      }

      // Mise à jour du livre dans la base de données
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() =>
          res.status(200).json({ message: 'Livre modifié avec succès !' })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.error('Erreur lors de la recherche du livre:', error);
      res.status(500).json({ error });
    });
};
//

// Contrôleur pour noter un livre
exports.rateBook = (req, res) => {
  const userId = req.auth.userId;
  const { rating } = req.body;

  // Convertir la note en nombre
  const grade = parseInt(rating, 10);
  if (isNaN(grade) || grade < 0 || grade > 5) {
    return res.status(400).json({
      message: 'Note invalide. Elle doit être un nombre entre 0 et 5.',
    });
  }

  // Trouver le livre par ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      // Vérifier si l'utilisateur a déjà noté le livre
      const existingRating = book.ratings.find(
        (rating) => rating.userId === userId
      );

      if (existingRating) {
        // Mettre à jour la note existante
        existingRating.grade = grade;
      } else {
        // Ajouter une nouvelle note
        book.ratings.push({ userId, grade });
      }

      // Calculer la nouvelle moyenne des notes
      const totalRatings = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      let averageRating = totalRatings / book.ratings.length;

      // Arrondir la moyenne à deux décimales
      book.averageRating = Math.round(averageRating * 100) / 100;

      // Sauvegarder les modifications dans le livre
      return book.save();
    })
    .then((savedBook) => {
      // Renvoyer toutes les informations du livre
      res.status(200).json({
        message: 'Livre noté avec succès !',
        id: savedBook._id,
        averageRating: savedBook.averageRating,
        ratings: savedBook.ratings,
        title: savedBook.title, // Titre
        author: savedBook.author, // Auteur
        imageUrl: savedBook.imageUrl, // Image du livre
        year: savedBook.year, // Année de publication
        genre: savedBook.genre, // Genre du livre
      });
    })
    .catch((error) => {
      console.error('Erreur lors de la sauvegarde du livre:', error);
      res.status(500).json({ error });
    });
};
//

// Contrôleur pour récupérer les 3 livres avec la meilleure note moyenne
exports.getBestRatedBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trier dans l'ordre décroissant
    .limit(3)
    .then((books) => {
      if (!books || books.length === 0) {
        return res.status(404).json({ message: 'Aucun livre trouvé !' });
      }
      res.status(200).json(books);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des livres:', error);
      res.status(500).json({ error });
    });
};
