import express from 'express';
import { PlantillaController } from '../controllers/plantillaControllers.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new PlantillaController();

router.post('/crear', verifyToken, requireRole('admin'), (req, res) => controller.crear(req, res));
router.get('/', verifyToken, requireRole('admin'), (req, res) => controller.listar(req, res));
router.get('/id/:id', verifyToken, requireRole('admin'), (req, res) => controller.obtenerPorId(req, res));

// Ejes
router.post('/:plantillaId/eje/:ejeId', verifyToken, requireRole('admin'), (req, res) => controller.addEje(req, res));
router.delete('/:plantillaId/eje/:ejeId', verifyToken, requireRole('admin'), (req, res) => controller.removeEje(req, res));
router.get('/:plantillaId/ejes', verifyToken, requireRole('admin'), (req, res) => controller.listarEjes(req, res));

// Indicadores
router.post('/:plantillaId/indicador/:indicadorId', verifyToken, requireRole('admin'), (req, res) => controller.addIndicador(req, res));
router.delete('/:plantillaId/indicador/:indicadorId', verifyToken, requireRole('admin'), (req, res) => controller.removeIndicador(req, res));
router.get('/:plantillaId/indicadores', verifyToken, requireRole('admin'), (req, res) => controller.listarIndicadores(req, res));

export default router;
