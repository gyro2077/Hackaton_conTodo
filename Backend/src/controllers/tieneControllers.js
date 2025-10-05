import { TieneService as TieneServiceClass } from '../services/tieneServices.js';

const tieneService = new TieneServiceClass();

export class TieneController {
  async crear(req, res) {
    try { const nuevo = await tieneService.createRelacion(req.body); res.status(201).json(nuevo); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) {
    try { res.status(200).json(await tieneService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorReporte(req, res) {
    try { res.status(200).json(await tieneService.buscarPorReporte(req.params.reporteId)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const { reporteId, ejeId } = req.params; const ok = await tieneService.eliminar(reporteId, ejeId); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
