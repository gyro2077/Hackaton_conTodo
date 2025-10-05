import pool from '../config/db.js';

export class ReporteIndicadoresRepository {
  async addIndicador(reporteId, ejeId, indicadorId) {
    const query = `INSERT INTO REPORTE_INDICADORES (REPORTEPROYECTO_ID, EJES_ID, INDICADORES_ID) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query(query, [reporteId, ejeId, indicadorId]);
    return rows[0];
  }

  async listarPorReporte(reporteId) {
    const { rows } = await pool.query(`SELECT i.* FROM REPORTE_INDICADORES ri JOIN INDICADORES i ON ri.INDICADORES_ID = i.INDICADORES_ID WHERE ri.REPORTEPROYECTO_ID = $1`, [reporteId]);
    return rows;
  }
}
