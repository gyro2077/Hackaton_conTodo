// Al inicio del archivo reporteControllers.js, importa los nuevos servicios
import { ReporteService as ReporteServiceClass } from '../services/reporteServices.js';
import { EmailService as EmailServiceClass } from '../services/emailService.js'; // <- AÑADIR
import { PaymentService as PaymentServiceClass } from '../services/paymentService.js'; // <- AÑADIR
import { AnalysisService as AnalysisServiceClass } from '../services/analysisService.js';

const reporteService = new ReporteServiceClass();
const emailService = new EmailServiceClass(); // <- AÑADIR
const paymentService = new PaymentServiceClass(); // <- AÑADIR
const analysisService = new AnalysisServiceClass(); // <-- AÑADE ESTA LÍNEA



export class ReporteController {
  async crear(req, res) {
    try {
      // 1. Crea el reporte en la base de datos (esto no cambia)
      const nuevoReporte = await reporteService.createReporte(req.body);

      // 2. Llama al servicio de Gemini con los datos del reporte recién creado
      const analisisGemini = await analysisService.analizarCoherenciaYResumir(nuevoReporte);

      // 3. Combina el reporte creado con el análisis en una sola respuesta
      const respuestaCombinada = {
        reporteCreado: nuevoReporte,
        analisisIA: analisisGemini
      };

      res.status(201).json(respuestaCombinada);
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async listar(req, res) {
    try { res.status(200).json(await reporteService.listarTodos()); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async obtenerPorId(req, res) {
    try { res.status(200).json(await reporteService.buscarPorId(req.params.id)); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async actualizar(req, res) {
    try {
      const data = { ...req.body, REPORTEPROYECTO_ID: req.params.id };
      const ok = await reporteService.actualizar(data);
      if (!ok) return res.status(404).json({ message: 'No encontrado' });
      res.status(200).json(await reporteService.buscarPorId(req.params.id));
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async eliminar(req, res) {
    try { const ok = await reporteService.eliminar(req.params.id); if (!ok) return res.status(404).json({ message: 'No encontrado' }); res.status(200).json({ message: 'Eliminado' }); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }

  async aprobarReporte(req, res) {
    try {
      const reporteId = req.params.id;
      // ✔️ SOLUCIÓN: Cambiamos req.usuario por req.user para que coincida con el middleware
      const usuarioAprobador = req.user;

      // 1. Validar que el usuario tenga el rol adecuado (ej: 'admin' o 'foundation-admin')
      if (usuarioAprobador.role !== 'admin') {
         return res.status(403).json({ message: 'No tiene permisos para aprobar reportes.' });
      }

      // 2. Llama al servicio para actualizar el estado del reporte en la BD
      const reporteCompleto = await reporteService.aprobar(reporteId, usuarioAprobador.id);
      
      if (!reporteCompleto) {
        return res.status(404).json({ message: 'Reporte no encontrado' });
      }
      
      // 3. Responde al frontend INMEDIATAMENTE.
      res.status(200).json({ 
        message: 'Reporte aprobado con éxito. El pago y la notificación se están procesando en segundo plano.',
        reporte: reporteCompleto 
      });

      // 4. Ejecuta las tareas asíncronas después de haber respondido.
      reporteCompleto.aprobadoPorNombre = usuarioAprobador.nombre;

      await Promise.all([
          emailService.enviarCorreoAprobacion(reporteCompleto),
          paymentService.iniciarPagoPlux(reporteCompleto)
      ]);

    } catch (error) {
      console.error('Error al aprobar reporte:', error);
    }
  }

}