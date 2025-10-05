// Al inicio del archivo reporteControllers.js, importa los nuevos servicios
import { ReporteService as ReporteServiceClass } from '../services/reporteServices.js';
import { EmailService as EmailServiceClass } from '../services/emailService.js'; // <- AÑADIR
import { PaymentService as PaymentServiceClass } from '../services/paymentService.js'; // <- AÑADIR

const reporteService = new ReporteServiceClass();
const emailService = new EmailServiceClass(); // <- AÑADIR
const paymentService = new PaymentServiceClass(); // <- AÑADIR

export class ReporteController {
  async crear(req, res) {
    try {
      const nuevo = await reporteService.createReporte(req.body);
      // If multiple created (mensual), return array; otherwise single object
      res.status(201).json(nuevo);
    } catch (error) { res.status(400).json({ message: error.message }); }
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

  // === AÑADIR ESTE NUEVO MÉTODO ===
  async aprobarReporte(req, res) {
    try {
      const reporteId = req.params.id;
      const usuarioAprobador = req.usuario; // Obtenido del token JWT verificado

      // 1. Validar que el usuario tenga el rol adecuado (ej: 'admin' o 'foundation-admin')
      if (usuarioAprobador.role !== 'admin') {
         return res.status(403).json({ message: 'No tiene permisos para aprobar reportes.' });
      }

      // 2. Llama al servicio para actualizar el estado del reporte en la BD
      // Asumimos que el servicio devuelve el reporte con toda la info necesaria
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
      // Le pasamos el nombre del aprobador para el correo.
      reporteCompleto.aprobadoPorNombre = usuarioAprobador.nombre;

      // Usamos un 'await' aquí solo para asegurar que ambas se disparen,
      // pero no bloquean la respuesta al cliente que ya se envió.
      await Promise.all([
          emailService.enviarCorreoAprobacion(reporteCompleto),
          paymentService.iniciarPagoPlux(reporteCompleto)
      ]);

    } catch (error) {
      console.error('Error al aprobar reporte:', error);
      // No envíes una respuesta de error aquí si ya enviaste una de éxito
      // Simplemente registra el error.
    }
  }
  // === FIN DEL NUEVO MÉTODO ===
}
