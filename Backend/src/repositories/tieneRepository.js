import pool from '../config/db.js';

export class TieneRepository {
  async create(tiene) {
    const query = `
      INSERT INTO TIENE (REPORTEPROYECTO_ID, EJES_ID)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [tiene.REPORTEPROYECTO_ID, tiene.EJES_ID];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM TIENE ORDER BY REPORTEPROYECTO_ID, EJES_ID`);
    return rows;
  }

  async buscarPorReporte(reporteId) {
    const { rows } = await pool.query(`SELECT * FROM TIENE WHERE REPORTEPROYECTO_ID = $1`, [reporteId]);
    return rows;
  }

  async eliminar(reporteId, ejeId) {
    const { rowCount } = await pool.query(`DELETE FROM TIENE WHERE REPORTEPROYECTO_ID = $1 AND EJES_ID = $2`, [reporteId, ejeId]);
    return rowCount > 0;
  }
}
