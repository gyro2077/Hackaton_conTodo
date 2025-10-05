import dotenv from 'dotenv';
dotenv.config();

import { UsuarioService } from '../src/services/usuarioServices.js';

async function run() {
  const svc = new UsuarioService();
  try {
    const admin = await svc.createUsuario({
      USUARIO_NOMBREONG: 'ADMIN',
      USUARIO_USER: 'admin',
      USUARIO_CONTRASENA: 'Admin@12345',
      USUARIO_ROLE: 'admin',
      USUARI_DESCRIPCION: 'Cuenta administrador quemada'    
    });
    console.log('Admin creado:', admin);
  } catch (err) {
    console.error('Error creando admin:', err.message || err);
    process.exit(1);
  }
  process.exit(0);
}

run();
