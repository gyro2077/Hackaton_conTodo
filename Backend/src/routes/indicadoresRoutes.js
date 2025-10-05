import express from 'express';
import { IndicadoresController } from '../controllers/indicadoresControllers.js';
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
const controller = new IndicadoresController();
router.use(verifyToken);
router.post('/crear', (req, res) => controller.crearIndicador(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/id/:id', (req, res) => controller.obtenerPorId(req, res));
router.get('/eje/:ejeId', (req, res) => controller.obtenerPorEje(req, res));
router.put('/actualizar/:id', (req, res) => controller.actualizar(req, res));
router.delete('/eliminar/:id', (req, res) => controller.eliminar(req, res));

export default router;
