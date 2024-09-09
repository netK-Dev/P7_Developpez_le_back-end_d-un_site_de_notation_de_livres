const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupérer le token après "Bearer"
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Décrypter le token avec la clé
    const userId = decodedToken.userId; // Extraire l'ID utilisateur du token
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée !' });
  }
};
