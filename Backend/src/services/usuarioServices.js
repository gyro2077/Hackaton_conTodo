import { UsuarioRepository } from '../repositories/usuarioRepository.js';
import { Validaciones } from '../utils/validaciones.js';
import bcrypt from 'bcrypt';

const usuarioRepo = new UsuarioRepository();

export class UsuarioService {
  async createUsuario(data) {
    if (!data.USUARIO_NOMBREONG || !data.USUARIO_USER || !data.USUARIO_CONTRASENA) {
      throw new Error('Nombre ONG, usuario y contraseña son obligatorios');
    }

    if (!Validaciones.soloLetras(data.USUARIO_NOMBREONG)) {
      throw new Error('El nombre de la ONG solo puede contener letras');
    }

    const hashed = await bcrypt.hash(data.USUARIO_CONTRASENA, 10);

    const newData = {
      ...data,
      USUARIO_NOMBREONG: Validaciones.convertirAMayusculas(data.USUARIO_NOMBREONG),
      USUARIO_CONTRASENA: hashed,
      USUARIO_ROLE: data.USUARIO_ROLE || 'ong'
    };

    return await usuarioRepo.create(newData);
  }

  async listarTodos() { return await usuarioRepo.listarTodos(); }
  async buscarPorId(id) { return await usuarioRepo.buscarPorId(id); }
  async buscarPorUsuario(user) { return await usuarioRepo.buscarPorUsuario(user); }
  async eliminar(id) { return await usuarioRepo.eliminar(id); }
  async actualizar(data) { return await usuarioRepo.actualizar(data); }
}
