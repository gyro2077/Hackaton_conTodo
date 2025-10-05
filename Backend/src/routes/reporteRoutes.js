import express from 'express';
import { ReporteController } from '../controllers/reporteControllers.js';
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
const controller = new ReporteController();
router.use(verifyToken);
router.post('/crear', (req, res) => controller.crear(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/id/:id', (req, res) => controller.obtenerPorId(req, res));
router.put('/actualizar/:id', (req, res) => controller.actualizar(req, res));
router.delete('/eliminar/:id', (req, res) => controller.eliminar(req, res));
// === AÑADIR ESTA NUEVA RUTA ===
// Esta ruta estará protegida y solo accesible con un token válido.
router.post('/:id/approve', verificarToken, reporteController.aprobarReporte);


export default router;
