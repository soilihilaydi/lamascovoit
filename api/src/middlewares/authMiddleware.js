import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Extraire le token de l'en-tête Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Stocker les informations de l'utilisateur dans l'objet de requête pour une utilisation ultérieure
    req.user = decoded;
    
    // Appeler la fonction suivante dans le middleware
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

export default authMiddleware;