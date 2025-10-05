import { TieneRepository } from '../repositories/tieneRepository.js';

const tieneRepo = new TieneRepository();

export class TieneService {
  async createRelacion(data) {
    if (!data.REPORTEPROYECTO_ID || !data.EJES_ID) {
      throw new Error('REPORTEPROYECTO_ID y EJES_ID son obligatorios');
    }
    return await tieneRepo.create(data);
  }

  async listarTodos() { return await tieneRepo.listarTodos(); }
  async buscarPorReporte(id) { return await tieneRepo.buscarPorReporte(id); }
  async eliminar(reporteId, ejeId) { return await tieneRepo.eliminar(reporteId, ejeId); }
}
