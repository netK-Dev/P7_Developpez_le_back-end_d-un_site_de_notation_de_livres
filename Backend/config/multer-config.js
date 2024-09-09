const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Configuration multer pour uploader dans un buffer
const storage = multer.memoryStorage(); // Utiliser la mémoire au lieu d'enregistrer directement

const upload = multer({ storage }).single('image');

// Middleware pour compresser et sauvegarder l'image
const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucun fichier, continuer
  }

  const extension = MIME_TYPES[req.file.mimetype];
  if (!extension) {
    return next(new Error('Invalid file type')); // Vérification du type MIME
  }

  const fileName =
    req.file.originalname.split(' ').join('_') + Date.now() + '.' + extension;
  const outputPath = path.join('images', fileName);

  try {
    // Compression avec sharp - traiter l'image depuis le buffer
    await sharp(req.file.buffer)
      .resize(800) // Redimensionner à 800px de largeur
      .jpeg({ quality: 80 }) // Compression avec qualité 80%
      .toFile(outputPath); // Enregistrer directement dans le répertoire 'images'

    // Ajouter le chemin de l'image compressée au req.file pour l'utiliser dans le contrôleur
    req.file.path = outputPath;
    req.file.filename = fileName;

    next(); // Continuer le traitement une fois la compression terminée
  } catch (error) {
    console.error(
      "Erreur lors de la compression et de la sauvegarde de l'image:",
      error
    );
    next(error); // Gestion des erreurs
  }
};

module.exports = { upload, compressImage };
