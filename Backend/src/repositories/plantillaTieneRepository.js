import pool from '../config/db.js';

export class PlantillaTieneRepository {
  async addEje(plantillaId, ejeId) {
    const query = `INSERT INTO PLANTILLA_TIENE (PLANTILLA_ID, EJES_ID) VALUES ($1, $2) RETURNING *`;
    const { rows } = await pool.query(query, [plantillaId, ejeId]);
    return rows[0];
  }

  async removeEje(plantillaId, ejeId) {
    const { rowCount } = await pool.query(`DELETE FROM PLANTILLA_TIENE WHERE PLANTILLA_ID = $1 AND EJES_ID = $2`, [plantillaId, ejeId]);
    return rowCount > 0;
  }

  async listarEjes(plantillaId) {
    const { rows } = await pool.query(`SELECT EJES.* FROM PLANTILLA_TIENE pt JOIN EJES ON pt.EJES_ID = EJES.EJES_ID WHERE pt.PLANTILLA_ID = $1`, [plantillaId]);
    return rows;
  }
}
