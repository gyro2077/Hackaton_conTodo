import pool from '../config/db.js';

export class RespuestaRepository {
  async createRespuesta(resp) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(RESPUESTA_ID), 0) + 1 AS nextId FROM REPORTE_RESPUESTAS`);
    const nextId = rowsMax[0].nextid;
    const query = `
      INSERT INTO REPORTE_RESPUESTAS (RESPUESTA_ID, REPORTEPROYECTO_ID, USUARIO_ID, EJES_ID, INDICADORES_ID, RESPUESTA_VALOR, RESPUESTA_FECHA)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [nextId, resp.REPORTEPROYECTO_ID, resp.USUARIO_ID, resp.EJES_ID, resp.INDICADORES_ID, resp.RESPUESTA_VALOR, resp.RESPUESTA_FECHA || new Date()];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarPorReporte(reporteId) {
    const { rows } = await pool.query(`SELECT * FROM REPORTE_RESPUESTAS WHERE REPORTEPROYECTO_ID = $1 ORDER BY RESPUESTA_ID`, [reporteId]);
    return rows;
  }
}
