import express from 'express';
import { RespuestaController } from '../controllers/respuestaControllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const controller = new RespuestaController();

// Only authenticated ONG users should be able to submit responses (we enforce role inside controller too)
router.post('/crear', verifyToken, (req, res) => controller.crear(req, res));
// Listing responses for a report requires auth as well (admins/owners)
router.get('/reporte/:reporteId', verifyToken, (req, res) => controller.listarPorReporte(req, res));

export default router;
