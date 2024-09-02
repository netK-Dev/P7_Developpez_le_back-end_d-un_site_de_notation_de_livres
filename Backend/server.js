// Importation des dépendances
const express = require('express');
const mongoose = require('mongoose'); // Importez mongoose pour se connecter à MongoDB

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
const mongoURI =
  'mongodb+srv://netK-Dev:292322Hugo@p7devweblivresmdb.ga8au.mongodb.net/votre_nom_de_base_de_donnees?retryWrites=true&w=majority&appName=P7DevWebLivresMDB';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur de connexion à MongoDB', err));

// Configuration de l'application
// (Par exemple, middleware, etc.)

// Définition des routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre serveur Express avec MongoDB connecté !'); // Exemple de route
});

// Lancement du serveur
const port = process.env.PORT || 4000; // Définition du port d'écoute
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
