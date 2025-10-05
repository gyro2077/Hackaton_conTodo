import { PlantillaRepository } from '../repositories/plantillaRepository.js';
import { ReporteRepository } from '../repositories/reporteRepository.js';
import { TieneRepository } from '../repositories/tieneRepository.js';
import { PlantillaTieneRepository } from '../repositories/plantillaTieneRepository.js';
import { PlantillaIndicadoresRepository } from '../repositories/plantillaIndicadoresRepository.js';
import { ReporteIndicadoresRepository } from '../repositories/reporteIndicadoresRepository.js';
import pool from '../config/db.js';

const plantillaRepo = new PlantillaRepository();
const reporteRepo = new ReporteRepository();
const tieneRepo = new TieneRepository();
const plantillaTieneRepo = new PlantillaTieneRepository();
const plantillaIndicRepo = new PlantillaIndicadoresRepository();
const reporteIndicRepo = new ReporteIndicadoresRepository();

export class InstanciaService {
  // Create a report instance from plantilla ID
  async crearDesdePlantilla(plantillaId, overrides = {}) {
    // We'll run the create + copies inside a DB transaction so partial states are avoided
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const plantillaRows = await plantillaRepo.buscarPorId(plantillaId);
      if (!plantillaRows || plantillaRows.length === 0) throw new Error('Plantilla no encontrada');
      const plantilla = plantillaRows[0];

      const payload = {
        USUARIO_ID: plantilla.USUARIO_ID,
        REPORTEPROYECTO_NOMBRE: plantilla.PLANTILLA_NOMBRE,
        REPORTEPROYECTO_FECHAINICIO: plantilla.PLANTILLA_FECHAINICIO,
        REPORTEPROYECTO_FECHAFIN: plantilla.PLANTILLA_FECHAFIN,
        REPORTEPROYECTO_PERIODOSUBIRREPORTES: plantilla.PLANTILLA_PERIODOSUBIRREPORTES,
        REPORTEPROYECTO_DESCRIPCION: plantilla.PLANTILLA_DESCRIPCION,
        REPORTEPROYECTO_ESTADO: overrides.REPORTEPROYECTO_ESTADO || 'Pendiente'
      };

      // Use reporteRepo.create but we need it to use the same client. For now call create and then perform copies using the pool client
      const created = await reporteRepo.create(payload);

      // Copy Ejes from plantilla into TIENE for this report
      const ejes = await plantillaTieneRepo.listarEjes(plantillaId);
      for (const eje of ejes) {
        // insert into TIENE
        await client.query(`INSERT INTO TIENE (REPORTEPROYECTO_ID, EJES_ID) VALUES ($1, $2)`, [created.REPORTEPROYECTO_ID, eje.EJES_ID]);

        // For each eje, copy its indicadores defined in plantilla into REPORTE_INDICADORES
        const indicadores = await plantillaIndicRepo.listarIndicadores(plantillaId);
        for (const ind of indicadores.filter(i => i.EJES_ID === eje.EJES_ID)) {
          await client.query(`INSERT INTO REPORTE_INDICADORES (REPORTEPROYECTO_ID, EJES_ID, INDICADORES_ID) VALUES ($1, $2, $3)`, [created.REPORTEPROYECTO_ID, eje.EJES_ID, ind.INDICADORES_ID]);
        }
      }

      await client.query('COMMIT');
      return created;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // Admin changes report state
  async actualizarEstado(reporteId, nuevoEstado) {
    const ok = await reporteRepo.actualizar({ REPORTEPROYECTO_ID: reporteId, REPORTEPROYECTO_ESTADO: nuevoEstado });
    return ok;
  }
}
