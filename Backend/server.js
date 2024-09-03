// Importation des dépendances
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express');
const connectDB = require('./config/mdb'); // Importation de la connexion MongoDB
const corsMiddleware = require('./middlewares/corsMiddleware');

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
connectDB();

// Middleware de configuration des en-têtes
app.use(corsMiddleware);

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
