const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Utiliser la variable d'environnement MONGO_URI

    await mongoose.connect(mongoURI);
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB', err);
    process.exit(1); // Arrête le serveur en cas d'échec de la connexion
  }
};

module.exports = connectDB;
