import { PlantillaService as PlantillaServiceClass } from '../services/plantillaServices.js';

const plantillaService = new PlantillaServiceClass();

export class PlantillaController {
  async crear(req, res) {
    try { const nuevo = await plantillaService.createPlantilla(req.body); res.status(201).json(nuevo); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listar(req, res) { try { res.status(200).json(await plantillaService.listarTodos()); } catch (error) { res.status(400).json({ message: error.message }); } }

  async obtenerPorId(req, res) { try { res.status(200).json(await plantillaService.buscarPorId(req.params.id)); } catch (error) { res.status(400).json({ message: error.message }); } }

  // Ejes
  async addEje(req, res) {
    try { const { plantillaId, ejeId } = req.params; const row = await plantillaService.addEje(plantillaId, ejeId); res.status(201).json(row); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async removeEje(req, res) {
    try { const { plantillaId, ejeId } = req.params; const ok = await plantillaService.removeEje(plantillaId, ejeId); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listarEjes(req, res) {
    try { res.status(200).json(await plantillaService.listarEjes(req.params.plantillaId)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  // Indicadores
  async addIndicador(req, res) {
    try { const { plantillaId, indicadorId } = req.params; const { ejeId } = req.body; const row = await plantillaService.addIndicador(plantillaId, ejeId, indicadorId); res.status(201).json(row); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async removeIndicador(req, res) {
    try { const { plantillaId, indicadorId } = req.params; const ok = await plantillaService.removeIndicador(plantillaId, indicadorId); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listarIndicadores(req, res) {
    try { res.status(200).json(await plantillaService.listarIndicadores(req.params.plantillaId)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
