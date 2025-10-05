import { ReporteService as ReporteServiceClass } from '../services/reporteServices.js';

const reporteService = new ReporteServiceClass();

export class ReporteController {
  async crear(req, res) {
    try {
      const nuevo = await reporteService.createReporte(req.body);
      // If multiple created (mensual), return array; otherwise single object
      res.status(201).json(nuevo);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) {
    try { res.status(200).json(await reporteService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try { res.status(200).json(await reporteService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try {
      const data = { ...req.body, REPORTEPROYECTO_ID: req.params.id };
      const ok = await reporteService.actualizar(data);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json(await reporteService.buscarPorId(req.params.id));
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const ok = await reporteService.eliminar(req.params.id); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
