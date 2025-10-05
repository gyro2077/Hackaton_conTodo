import { EjesRepository } from '../repositories/ejeRepository.js';
import { Validaciones } from '../utils/validaciones.js';

const ejesRepo = new EjesRepository();

export class EjesService {
  
  // Método para crear un eje
  async createEje(data) {
    // Validaciones obligatorias
    if (!data.EJES_NOMBRE || !data.EJES_DESCRIPCION) {
      throw new Error("El nombre y la descripción son obligatorios");
    }

    if (!Validaciones.soloLetras(data.EJES_NOMBRE)) {
      throw new Error("El nombre solo puede contener letras");
    }

    if (!Validaciones.soloLetras(data.EJES_DESCRIPCION)) {
      throw new Error("La descripción solo puede contener letras");
    }

    // Convertir a mayúsculas antes de guardar
    const ejeNombre = Validaciones.convertirAMayusculas(data.EJES_NOMBRE);

    const newData = {
      ...data,
      EJES_NOMBRE: ejeNombre,
    };

    // Guardar en repositorio
    const newEje = await ejesRepo.create(newData);
    return newEje;
  }

  // Método para actualizar un eje
  async actualizarEje(data) {
    if (!data.EJES_ID) {
      throw new Error("El ID del eje es obligatorio");
    }

    if (!Validaciones.soloLetras(data.EJES_NOMBRE)) {
      throw new Error("El nombre solo puede contener letras");
    }

    if (!Validaciones.soloLetras(data.EJES_DESCRIPCION)) {
      throw new Error("La descripción solo puede contener letras");
    }

    const ejeNombre = Validaciones.convertirAMayusculas(data.EJES_NOMBRE);

    const actualizado = await ejesRepo.actualizar({
      EJES_ID: data.EJES_ID,
      EJES_NOMBRE: ejeNombre,
      EJES_DESCRIPCION: data.EJES_DESCRIPCION
    });

    if (!actualizado) {
      throw new Error("No se encontró el eje para actualizar");
    }

    return await ejesRepo.buscarPorId(data.EJES_ID);
  }

  // Método para listar todos los ejes
  async obtenerTodosLosEjes() {
    return await ejesRepo.listarTodos();
  }

  // Método para buscar por nombre
  async obtenerEjePorNombre(nombre) {
    return await ejesRepo.buscarPorNombre(nombre);
  }

  // Método para eliminar un eje
  async eliminarEje(id) {
    return await ejesRepo.eliminar(id);
  }

  // Método para buscar por ID
  async obtenerEjePorId(id) {
    return await ejesRepo.buscarPorId(id);
  }

  // Métodos de ordenamiento (si los agregas en el repositorio)
  async obtenerEjesOrdenDesc() {
    return await ejesRepo.ordenarDescendente();
  }

  async obtenerEjesOrdenAsc() {
    return await ejesRepo.ordenarAscendente();
  }
}
