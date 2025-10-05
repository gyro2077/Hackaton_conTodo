import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verify token from multiple possible locations and formats
export const verifyToken = (req, res, next) => {
  try {
    // Try Authorization header: "Bearer <token>" or raw token
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token = null;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      } else if (parts.length === 1) {
        token = parts[0];
      }
    }

    // Fallback to x-access-token header
    if (!token && (req.headers['x-access-token'] || req.headers['X-Access-Token'])) {
      token = req.headers['x-access-token'] || req.headers['X-Access-Token'];
    }

    // Fallback to query param ?token=...
    if (!token && req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET no está configurado en el entorno');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ message: 'Token inválido o expirado.', error: err.message });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Unexpected auth error:', err);
    return res.status(500).json({ message: 'Error interno de autenticación' });
  }
};

// Middleware generator to require a specific role (e.g., 'admin')
export const requireRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'No autenticado' });
      const userRole = req.user.role || req.user.USUARIO_ROLE || req.user.usuario_role;
      if (!userRole) return res.status(403).json({ message: 'Rol no encontrado en token' });
      if (userRole.toLowerCase() !== role.toLowerCase()) {
        return res.status(403).json({ message: 'Acceso denegado. Requiere rol: ' + role });
      }
      next();
    } catch (err) {
      console.error('Role check error:', err);
      return res.status(500).json({ message: 'Error interno al verificar rol' });
    }
  };
};
