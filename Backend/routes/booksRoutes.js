const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, compressImage } = require('../config/multer-config');
const booksCtrl = require('../controllers/booksCtrl');

// Route POST pour ajouter un livre
router.post('/books', auth, upload, compressImage, booksCtrl.createBook);
// Route pour récupérer tous les livres
router.get('/books', booksCtrl.getAllBooks);

module.exports = router;
