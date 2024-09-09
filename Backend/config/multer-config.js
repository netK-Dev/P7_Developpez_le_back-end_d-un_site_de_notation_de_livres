const multer = require('multer');
const sharp = require('sharp'); // Ajouter sharp
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Dossier de stockage
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    if (!extension) {
      return callback(new Error('Invalid file type'));
    }
    callback(null, name + Date.now() + '.' + extension);
  },
});

const upload = multer({ storage }).single('image');

// Middleware de compression d'image après upload
const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucun fichier, continuer
  }

  const inputPath = req.file.path;
  const outputPath = path.join('compressed', req.file.filename);

  try {
    // Compression avec sharp
    await sharp(inputPath)
      .resize(800) // Redimensionner à 800px de largeur, conserve l'aspect ratio
      .jpeg({ quality: 80 }) // Compression en JPEG avec qualité 80%
      .toFile(outputPath);

    // Supprimer l'image d'origine
    fs.unlinkSync(inputPath);

    // Remplacer le chemin du fichier compressé
    req.file.path = outputPath;
    next();
  } catch (error) {
    next(error); // Gestion des erreurs
  }
};

module.exports = { upload, compressImage };
