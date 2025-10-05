import express from 'express';
import { EjesController } from '../controllers/ejeControllers.js';
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
const controller = new EjesController();

/**
 * Rutas para gestión de Ejes
 */
router.use(verifyToken);
// Crear un nuevo eje
router.post('/crear', (req, res) => controller.crearEje(req, res));

// Actualizar un eje existente
router.put('/actualizar/:id', (req, res) => controller.actualizarEje(req, res));

// Eliminar un eje por ID
router.delete('/eliminar/:id', (req, res) => controller.eliminarEje(req, res));

// Obtener todos los ejes
router.get('/', (req, res) => controller.obtenerTodosLosEjes(req, res));

// Obtener un eje por ID
router.get('/id/:id', (req, res) => controller.obtenerEjePorId(req, res));

// Obtener un eje por nombre
router.get('/nombre/:nombre', (req, res) => controller.obtenerEjePorNombre(req, res));

// Obtener ejes ordenados por ID ascendente
router.get('/orden/asc', (req, res) => controller.ordenarAsc(req, res));

// Obtener ejes ordenados por ID descendente
router.get('/orden/desc', (req, res) => controller.ordenarDesc(req, res));

export default router;
