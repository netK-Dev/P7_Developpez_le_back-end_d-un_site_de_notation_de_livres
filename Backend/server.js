// Importation des dépendances
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express');
const connectDB = require('./config/mdb');
const corsMiddleware = require('./middlewares/corsMiddleware');
const userRoutes = require('./routes/userRoutes');

// Création de l'application Express
const app = express();

// Connexion à la base de données MongoDB
connectDB();

// Middleware de configuration des en-têtes
app.use(corsMiddleware);

// Routes :
app.use('/api/auth', userRoutes);

// Lancement du serveur + définition du port d'écoute
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
