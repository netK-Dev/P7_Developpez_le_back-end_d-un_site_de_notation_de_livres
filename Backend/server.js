// Importation des dépendances
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env
const express = require('express');
const path = require('path');
const connectDB = require('./config/mdb');
const corsMiddleware = require('./middlewares/corsMiddleware');
const userRoutes = require('./routes/usersRoutes');
const booksRoutes = require('./routes/booksRoutes');

// Création de l'application Express
const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données MongoDB
connectDB();

// Middleware de configuration des en-têtes
app.use(corsMiddleware);

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes :
app.use('/api/auth', userRoutes);
app.use('/api', booksRoutes);

// Lancement du serveur + définition du port d'écoute
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
