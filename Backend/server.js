// Importation des dépendances
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express');
const connectDB = require('./config/mdb'); // Importation de la connexion MongoDB
const corsMiddleware = require('./middlewares/corsMiddleware');
const userRoutes = require('./routes/user');

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
connectDB();

// Middleware de configuration des en-têtes
app.use(corsMiddleware);

// Routes :

// Lancement du serveur
const port = process.env.PORT; // Définition du port d'écoute
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
