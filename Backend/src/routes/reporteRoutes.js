import express from 'express';
import { ReporteController } from '../controllers/reporteControllers.js';
// ✔️ CORRECCIÓN 1: El nombre importado es 'verifyToken', no 'verificarToken'.
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const controller = new ReporteController();

// Aplicamos el middleware a todas las rutas que lo necesiten.
// Es mejor ser explícito en cada ruta en lugar de usar router.use() para todo el archivo.

router.post('/crear', verifyToken, (req, res) => controller.crear(req, res));
router.get('/', verifyToken, (req, res) => controller.listar(req, res));
router.get('/id/:id', verifyToken, (req, res) => controller.obtenerPorId(req, res));
router.put('/actualizar/:id', verifyToken, (req, res) => controller.actualizar(req, res));
router.delete('/eliminar/:id', verifyToken, (req, res) => controller.eliminar(req, res));

// === RUTA CORREGIDA ===
// ✔️ CORRECCIÓN 2: Usamos el nombre correcto 'verifyToken'.
// ✔️ CORRECCIÓN 3: Usamos la instancia correcta del controlador que definiste: 'controller', no 'reporteController'.
router.post('/:id/approve', verifyToken, (req, res) => controller.aprobarReporte(req, res));

export default router;