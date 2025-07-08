const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener el token del header
  const token = req.header('Authorization');

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  // Verificar el token
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded; // Adjuntar el payload decodificado a req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no es válido' });
  }
}; 