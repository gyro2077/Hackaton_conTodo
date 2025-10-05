import express from 'express';

// importa las rutas específicas
import ejeRoutes from './ejeRoutes.js';
import indicadoresRoutes from './indicadoresRoutes.js';
import reporteRoutes from './reporteRoutes.js';
import tieneRoutes from './tieneRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import authRoutes from './authRoutes.js';
import plantillaRoutes from './plantillaRoutes.js';
import respuestaRoutes from './respuestaRoutes.js';
import instanciaRoutes from './instanciaRoutes.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   
 */

// se montan las rutas en paths base
router.use('/eje', ejeRoutes);
router.use('/indicadores', indicadoresRoutes);
router.use('/reporte', reporteRoutes);
router.use('/tiene', tieneRoutes);
router.use('/usuario', usuarioRoutes);
router.use('/auth', authRoutes);
router.use('/plantilla', plantillaRoutes);
router.use('/respuesta', respuestaRoutes);
router.use('/instancia', instanciaRoutes);


export default router;
