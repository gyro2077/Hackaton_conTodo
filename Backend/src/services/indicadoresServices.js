import { IndicadoresRepository } from '../repositories/indicadoresRepository.js';
import { Validaciones } from '../utils/validaciones.js';

const indicadoresRepo = new IndicadoresRepository();

export class IndicadoresService {
  async createIndicador(data) {
    if (!data.EJES_ID || !data.INDICADORES_NOMBRE) {
      throw new Error('EJES_ID y INDICADORES_NOMBRE son obligatorios');
    }

    if (!Validaciones.soloLetras(data.INDICADORES_NOMBRE)) {
      throw new Error('El nombre solo puede contener letras');
    }

    const newData = {
      ...data,
      INDICADORES_NOMBRE: Validaciones.convertirAMayusculas(data.INDICADORES_NOMBRE)
    };

    return await indicadoresRepo.create(newData);
  }

  async listarTodos() { return await indicadoresRepo.listarTodos(); }
  async buscarPorId(id) { return await indicadoresRepo.buscarPorId(id); }
  async buscarPorEje(ejeId) { return await indicadoresRepo.buscarPorEje(ejeId); }
  async eliminar(id) { return await indicadoresRepo.eliminar(id); }
  async actualizar(data) { return await indicadoresRepo.actualizar(data); }
}
