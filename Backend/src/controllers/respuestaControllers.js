import { RespuestaRepository } from '../repositories/respuestaRepository.js';
import { ReporteRepository } from '../repositories/reporteRepository.js';

const respuestaRepo = new RespuestaRepository();
const reporteRepo = new ReporteRepository();

function inMonthlyWindow() {
  const d = new Date();
  const day = d.getDate();
  return day >= 1 && day <= 9;
}

export class RespuestaController {
  async crear(req, res) {
    try {
      const payload = req.body;
      // expected: REPORTEPROYECTO_ID, EJES_ID, INDICADORES_ID, RESPUESTA_VALOR

      // Use authenticated user id when available
      if (req.user && req.user.id) payload.USUARIO_ID = req.user.id;

      // Verify report exists and check its period
      const repRows = await reporteRepo.buscarPorId(payload.REPORTEPROYECTO_ID);
      if (!repRows || repRows.length === 0) return res.status(404).json({ message: 'Reporte no encontrado' });
      const report = repRows[0];

      const periodRaw = report.REPORTEPROYECTO_PERIODOSUBIRREPORTES || report.PLANTILLA_PERIODOSUBIRREPORTES || '';
      const period = periodRaw.toString().toLowerCase();

      // Support 'mensual' default (days 1-9) or explicit ranges like '1-9'
      if (period === 'mensual') {
        if (!inMonthlyWindow()) return res.status(403).json({ message: 'Fuera de ventana de envío (mensual: días 1-9)' });
      } else if (/^\d{1,2}-\d{1,2}$/.test(period)) {
        const [start, end] = period.split('-').map(n => parseInt(n, 10));
        const day = new Date().getDate();
        if (day < start || day > end) return res.status(403).json({ message: `Fuera de ventana de envío (días ${start}-${end})` });
      }

      const saved = await respuestaRepo.createRespuesta(payload);
      res.status(201).json(saved);
    } catch (error) { res.status(400).json({ message: error.message }); }
  }

  async listarPorReporte(req, res) {
    try { const rows = await respuestaRepo.listarPorReporte(req.params.reporteId); res.status(200).json(rows); }
    catch (error) { res.status(400).json({ message: error.message }); }
  }
}
