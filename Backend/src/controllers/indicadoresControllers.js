import { IndicadoresService as IndicadoresServiceClass } from '../services/indicadoresServices.js';

const indicadoresService = new IndicadoresServiceClass();

export class IndicadoresController {
  async crearIndicador(req, res) {
    try {
      const nuevo = await indicadoresService.createIndicador(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async listar(req, res) {
    try {
      const items = await indicadoresService.listarTodos();
      res.status(200).json(items);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const item = await indicadoresService.buscarPorId(id);
      res.status(200).json(item);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorEje(req, res) {
    try {
      const { ejeId } = req.params;
      const items = await indicadoresService.buscarPorEje(ejeId);
      res.status(200).json(items);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try {
      const data = { ...req.body, INDICADORES_ID: req.params.id };
      const ok = await indicadoresService.actualizar(data);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json(await indicadoresService.buscarPorId(req.params.id));
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const ok = await indicadoresService.eliminar(id);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json({ message: 'Eliminado' });
    } catch (error) { res.status(400).json({ message: error.message }); }
  }
}
