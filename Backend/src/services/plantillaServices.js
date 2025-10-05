import { PlantillaRepository } from '../repositories/plantillaRepository.js';
import { PlantillaIndicadoresRepository } from '../repositories/plantillaIndicadoresRepository.js';
import { PlantillaTieneRepository } from '../repositories/plantillaTieneRepository.js';
import { PlantillaRepository as _unused } from '../repositories/plantillaRepository.js';

const plantillaRepo = new PlantillaRepository();
const plantillaIndicRepo = new PlantillaIndicadoresRepository();
const plantillaTieneRepo = new PlantillaTieneRepository();

export class PlantillaService {
  async createPlantilla(data) {
    if (!data.USUARIO_ID || !data.PLANTILLA_NOMBRE) {
      throw new Error('USUARIO_ID y nombre de plantilla son obligatorios');
    }
    return await plantillaRepo.create(data);
  }

  async listarTodos() { return await plantillaRepo.listarTodos(); }
  async buscarPorId(id) { return await plantillaRepo.buscarPorId(id); }

  // Manage ejes for plantilla
  async addEje(plantillaId, ejeId) { return await plantillaTieneRepo.addEje(plantillaId, ejeId); }
  async removeEje(plantillaId, ejeId) { return await plantillaTieneRepo.removeEje(plantillaId, ejeId); }
  async listarEjes(plantillaId) { return await plantillaTieneRepo.listarEjes(plantillaId); }

  // Manage indicadores for plantilla
  async addIndicador(plantillaId, ejeId, indicadorId) { return await plantillaIndicRepo.addIndicador(plantillaId, ejeId, indicadorId); }
  async removeIndicador(plantillaId, indicadorId) { return await plantillaIndicRepo.removeIndicador(plantillaId, indicadorId); }
  async listarIndicadores(plantillaId) { return await plantillaIndicRepo.listarIndicadores(plantillaId); }
}
