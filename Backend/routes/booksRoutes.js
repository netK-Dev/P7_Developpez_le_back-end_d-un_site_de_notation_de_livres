const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, compressImage } = require('../config/multer-config');
const booksCtrl = require('../controllers/booksCtrl');

// Route pour récupérer les 3 livres les mieux notés
router.get('/books/bestrating', booksCtrl.getBestRatedBooks);
// Route pour récupérer tous les livres
router.get('/books', booksCtrl.getAllBooks);
// Route pour récupérer un livre par ID (à mettre après /bestrating)
router.get('/books/:id', booksCtrl.getOneBook);
// Route POST pour ajouter un livre
router.post('/books', auth, upload, compressImage, booksCtrl.createBook);
// Route DELETE pour supprimer un livre
router.delete('/books/:id', auth, booksCtrl.deleteBook);
// Route pour modifier un livre
router.put('/books/:id', auth, upload, compressImage, booksCtrl.modifyBook);
// Route pour noter un livre
router.post('/books/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;
