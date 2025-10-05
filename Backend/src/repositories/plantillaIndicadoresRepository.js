import pool from '../config/db.js';

export class PlantillaIndicadoresRepository {
  async addIndicador(plantillaId, ejeId, indicadorId) {
    const query = `INSERT INTO PLANTILLA_INDICADORES (PLANTILLA_ID, EJES_ID, INDICADORES_ID) VALUES ($1, $2, $3) RETURNING *`;
    const { rows } = await pool.query(query, [plantillaId, ejeId, indicadorId]);
    return rows[0];
  }

  async removeIndicador(plantillaId, indicadorId) {
    const { rowCount } = await pool.query(`DELETE FROM PLANTILLA_INDICADORES WHERE PLANTILLA_ID = $1 AND INDICADORES_ID = $2`, [plantillaId, indicadorId]);
    return rowCount > 0;
  }

  // Return indicators together with the EJES_ID they belong to in the plantilla
  async listarIndicadores(plantillaId) {
    const { rows } = await pool.query(
      `SELECT i.*, pi.EJES_ID FROM PLANTILLA_INDICADORES pi JOIN INDICADORES i ON pi.INDICADORES_ID = i.INDICADORES_ID WHERE pi.PLANTILLA_ID = $1`,
      [plantillaId]
    );
    return rows;
  }
}
