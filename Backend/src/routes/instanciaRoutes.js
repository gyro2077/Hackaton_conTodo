import express from 'express';
import { InstanciaController } from '../controllers/instanciaControllers.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new InstanciaController();

// Crear instancia de reporte desde plantilla
router.post('/crear-desde-plantilla/:plantillaId', verifyToken, requireRole('admin'), (req, res) => controller.crearDesdePlantilla(req, res));

// Cambiar estado del reporte (admin review)
router.put('/cambiar-estado/:id', verifyToken, requireRole('admin'), (req, res) => controller.cambiarEstado(req, res));

export default router;
