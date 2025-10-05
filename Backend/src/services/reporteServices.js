import { ReporteRepository } from '../repositories/reporteRepository.js';
import { UsuarioRepository } from '../repositories/usuarioRepository.js';
import { TieneRepository } from '../repositories/tieneRepository.js';
import { Validaciones } from '../utils/validaciones.js';

const reporteRepo = new ReporteRepository();
const usuarioRepo = new UsuarioRepository();
const tieneRepo = new TieneRepository();

export class ReporteService {
  /**
   * Create a report. If period is 'mensual' (case-insensitive), create 9 duplicated
   * reports (one per month 1..9) with a month suffix in the name. Optionally attach EJES via TIENE.
   * Returns the created report or an array of created reports.
   */
  async createReporte(data) {
    // Required minimal fields
    if (!data.USUARIO_ID || !data.REPORTEPROYECTO_NOMBRE || !data.REPORTEPROYECTO_FECHAINICIO || !data.REPORTEPROYECTO_FECHAFIN) {
      throw new Error('USUARIO_ID, nombre, fecha inicio y fecha fin son obligatorios');
    }

    // Fetch user to include ONG name and validate existence
    const usuarioRows = await usuarioRepo.buscarPorId(data.USUARIO_ID);
    if (!usuarioRows || usuarioRows.length === 0) {
      throw new Error('USUARIO_ID no encontrado');
    }
    const usuario = usuarioRows[0];

    // Set default estado to 'Pendiente' if not provided
    const estado = data.REPORTEPROYECTO_ESTADO ? data.REPORTEPROYECTO_ESTADO : 'Pendiente';

    // Normalize name to uppercase as before
    const baseName = Validaciones.convertirAMayusculas(data.REPORTEPROYECTO_NOMBRE);

    const period = (data.REPORTEPROYECTO_PERIODOSUBIRREPORTES || '').toString().toLowerCase();

    const created = [];

    if (period === 'mensual') {
      // Create 9 duplicated reports for months 1..9
      for (let m = 1; m <= 9; m++) {
        const cloned = {
          ...data,
          REPORTEPROYECTO_NOMBRE: `${baseName} - MES ${m}`,
          REPORTEPROYECTO_ESTADO: estado
        };
        const row = await reporteRepo.create(cloned);
        // attach EJES if provided
        if (Array.isArray(data.EJES) && data.EJES.length > 0) {
          for (const ejeId of data.EJES) {
            await tieneRepo.create({ REPORTEPROYECTO_ID: row.REPORTEPROYECTO_ID, EJES_ID: ejeId });
          }
        }
        // add ONG name to response object
        row.USUARIO_NOMBREONG = usuario.USUARIO_NOMBREONG;
        created.push(row);
      }
      return created;
    }

    // Default: single report
    const newData = {
      ...data,
      REPORTEPROYECTO_NOMBRE: baseName,
      REPORTEPROYECTO_ESTADO: estado
    };

    const row = await reporteRepo.create(newData);

    if (Array.isArray(data.EJES) && data.EJES.length > 0) {
      for (const ejeId of data.EJES) {
        await tieneRepo.create({ REPORTEPROYECTO_ID: row.REPORTEPROYECTO_ID, EJES_ID: ejeId });
      }
    }

    row.USUARIO_NOMBREONG = usuario.USUARIO_NOMBREONG;
    return row;
  }

  async aprobar(id, usuarioId) {
    // 1. Llama al repositorio para actualizar la base de datos
    const reporteActualizado = await reporteRepo.aprobar(id, usuarioId);

    if (!reporteActualizado) {
      return null; // Si no se actualizó nada, devuelve null
    }

    // 2. (Opcional pero recomendado) Al igual que en createReporte, 
    // enriquecemos el objeto con el nombre de la ONG para que el controlador 
    // tenga toda la información que necesita.
    const usuarioRows = await usuarioRepo.buscarPorId(reporteActualizado.usuario_id);
    if (usuarioRows && usuarioRows.length > 0) {
      reporteActualizado.USUARIO_NOMBREONG = usuarioRows[0].usuario_nombreong;
    }

    return reporteActualizado;
  }

  async listarTodos() { return await reporteRepo.listarTodos(); }
  async buscarPorId(id) { return await reporteRepo.buscarPorId(id); }
  async eliminar(id) { return await reporteRepo.eliminar(id); }
  async actualizar(data) { return await reporteRepo.actualizar(data); }
}
