import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UsuarioRepository } from '../repositories/usuarioRepository.js';
import bcrypt from 'bcrypt';

dotenv.config();

const usuarioRepo = new UsuarioRepository();

export class AuthController {
  // POST /auth/login
  async login(req, res) {
    try {
      const { user, password } = req.body;
      if (!user || !password) {
        return res.status(400).json({ message: 'user y password son requeridos' });
      }

      const users = await usuarioRepo.buscarPorUsuario(user);
      if (!users || users.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const usuario = users[0];
      const match = await bcrypt.compare(password, usuario.usuario_contrasena || usuario.USUARIO_CONTRASENA || usuario.USUARIO_CONTRASENA);
      if (!match) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET no está configurado en el entorno');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      const payload = {
        id: usuario.usuario_id || usuario.USUARIO_ID,
        nombre: usuario.usuario_nombreong || usuario.USUARIO_NOMBREONG,
        user: usuario.usuario_user || usuario.USUARIO_USER,
        role: usuario.usuario_role || usuario.USUARIO_ROLE || 'ong'
      };

      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: error.message });
    }
  }
}
