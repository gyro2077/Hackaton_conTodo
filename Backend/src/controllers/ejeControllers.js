import { EjesService as EjesServiceClass } from '../services/ejeServices.js';

const ejesService = new EjesServiceClass();

export class EjesController {

  // Crear un nuevo eje
  async crearEje(req, res) {
    try {
      const ejeData = req.body;
      const nuevoEje = await ejesService.createEje(ejeData);
      res.status(201).json(nuevoEje);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Actualizar un eje
  async actualizarEje(req, res) {
    try {
      const ejeData = {
        ...req.body,
        EJES_ID: req.params.id
      };
      const actualizado = await ejesService.actualizarEje(ejeData);
      res.status(200).json(actualizado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Eliminar un eje
  async eliminarEje(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ejesService.eliminarEje(id);
      if (!resultado) {
        return res.status(404).json({ message: "No se encontró el eje" });
      }
      res.status(200).json({ message: "Eje eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Listar todos los ejes
  async obtenerTodosLosEjes(req, res) {
    try {
      const ejes = await ejesService.obtenerTodosLosEjes();
      res.status(200).json(ejes);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Obtener eje por nombre
  async obtenerEjePorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const eje = await ejesService.obtenerEjePorNombre(nombre);
      res.status(200).json(eje);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Obtener eje por ID
  async obtenerEjePorId(req, res) {
    try {
      const { id } = req.params;
      const eje = await ejesService.obtenerEjePorId(id);
      if (!eje || eje.length === 0) {
        return res.status(404).json({ message: "No se encontró el eje" });
      }
      res.status(200).json(eje);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Ordenar ejes ascendente
  async ordenarAsc(req, res) {
    try {
      const ejes = await ejesService.ordenarAsc();
      res.status(200).json(ejes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Ordenar ejes descendente
  async ordenarDesc(req, res) {
    try {
      const ejes = await ejesService.obtenerEjesOrdenDesc();
      res.status(200).json(ejes);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}
