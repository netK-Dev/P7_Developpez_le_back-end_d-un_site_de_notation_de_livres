const fs = require('fs');
const Book = require('../models/booksModel');

// Contrôleur pour récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find() // Utilisation de Mongoose pour récupérer tous les livres
    .then((books) => res.status(200).json(books)) // Renvoie tous les livres sous forme de JSON
    .catch((error) => res.status(400).json({ error })); // Gère les erreurs
};

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

// Contrôleur pour supprimer un livre
exports.deleteBook = (req, res) => {
  console.log('Tentative de suppression du livre avec ID:', req.params.id); // Debug

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
      console.log('Fichier image à supprimer:', filename); // Debug

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
