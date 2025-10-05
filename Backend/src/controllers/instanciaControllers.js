import { InstanciaService as InstanciaServiceClass } from '../services/instanciaServices.js';

const instanciaService = new InstanciaServiceClass();

export class InstanciaController {
  async crearDesdePlantilla(req, res) {
    try {
      const { plantillaId } = req.params;
      const created = await instanciaService.crearDesdePlantilla(plantillaId, req.body);
      res.status(201).json(created);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const ok = await instanciaService.actualizarEstado(id, estado);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json({ message: 'Estado actualizado' });
    } catch (error) { res.status(400).json({ message: error.message }); }
  }
}
