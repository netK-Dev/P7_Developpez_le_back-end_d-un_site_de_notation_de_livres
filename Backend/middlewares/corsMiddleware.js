const corsMiddleware = (req, res, next) => {
  // Permet l'accès à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  // Permet d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
};

module.exports = corsMiddleware;
