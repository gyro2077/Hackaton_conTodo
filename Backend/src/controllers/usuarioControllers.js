import { UsuarioService as UsuarioServiceClass } from '../services/usuarioServices.js';

const usuarioService = new UsuarioServiceClass();

export class UsuarioController {
  async crear(req, res) {
    try { const nuevo = await usuarioService.createUsuario(req.body); res.status(201).json(nuevo); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) {
    try { res.status(200).json(await usuarioService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try { res.status(200).json(await usuarioService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try { const data = { ...req.body, USUARIO_ID: req.params.id }; const ok = await usuarioService.actualizar(data); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json(await usuarioService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const ok = await usuarioService.eliminar(req.params.id); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
