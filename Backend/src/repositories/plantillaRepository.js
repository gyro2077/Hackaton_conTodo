import pool from '../config/db.js';

export class PlantillaRepository {
  async create(plantilla) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(PLANTILLA_ID), 0) + 1 AS nextId FROM PLANTILLA_REPORTE`);
    const nextId = rowsMax[0].nextid;

    const query = `
      INSERT INTO PLANTILLA_REPORTE (PLANTILLA_ID, USUARIO_ID, PLANTILLA_NOMBRE, PLANTILLA_FECHAINICIO, PLANTILLA_FECHAFIN, PLANTILLA_PERIODOSUBIRREPORTES, PLANTILLA_DESCRIPCION)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [nextId, plantilla.USUARIO_ID, plantilla.PLANTILLA_NOMBRE, plantilla.PLANTILLA_FECHAINICIO, plantilla.PLANTILLA_FECHAFIN, plantilla.PLANTILLA_PERIODOSUBIRREPORTES, plantilla.PLANTILLA_DESCRIPCION];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM PLANTILLA_REPORTE ORDER BY PLANTILLA_ID`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM PLANTILLA_REPORTE WHERE PLANTILLA_ID = $1`, [id]);
    return rows;
  }
}
