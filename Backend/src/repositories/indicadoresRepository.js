import pool from '../config/db.js';

export class IndicadoresRepository {
  async create(indicador) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(INDICADORES_ID), 0) + 1 AS nextId FROM INDICADORES`);
    const nextId = rowsMax[0].nextid;

    const query = `
      INSERT INTO INDICADORES (INDICADORES_ID, EJES_ID, INDICADORES_NOMBRE, INDICADORES_DESCRIPCION, INDICADORES_VALOR)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [nextId, indicador.EJES_ID, indicador.INDICADORES_NOMBRE, indicador.INDICADORES_DESCRIPCION, indicador.INDICADORES_VALOR];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM INDICADORES ORDER BY INDICADORES_ID`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM INDICADORES WHERE INDICADORES_ID = $1`, [id]);
    return rows;
  }

  async buscarPorEje(ejesId) {
    const { rows } = await pool.query(`SELECT * FROM INDICADORES WHERE EJES_ID = $1`, [ejesId]);
    return rows;
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM INDICADORES WHERE INDICADORES_ID = $1`, [id]);
    return rowCount > 0;
  }

  async actualizar(indicador) {
    const campos = [];
    const values = [];
    let i = 1;

    if (indicador.EJES_ID) { campos.push(`EJES_ID = $${i}`); values.push(indicador.EJES_ID); i++; }
    if (indicador.INDICADORES_NOMBRE) { campos.push(`INDICADORES_NOMBRE = $${i}`); values.push(indicador.INDICADORES_NOMBRE); i++; }
    if (indicador.INDICADORES_DESCRIPCION) { campos.push(`INDICADORES_DESCRIPCION = $${i}`); values.push(indicador.INDICADORES_DESCRIPCION); i++; }
    if (indicador.INDICADORES_VALOR) { campos.push(`INDICADORES_VALOR = $${i}`); values.push(indicador.INDICADORES_VALOR); i++; }

    if (campos.length === 0) return false;
    values.push(indicador.INDICADORES_ID);
    const query = `UPDATE INDICADORES SET ${campos.join(', ')} WHERE INDICADORES_ID = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
