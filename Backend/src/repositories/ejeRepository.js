import pool from '../config/db.js';

export class EjesRepository {

  // Crear un nuevo eje
  async create(eje) {
    // Validar si ya existe
    const existente = await pool.query(
      `SELECT 1 
       FROM EJES 
       WHERE UPPER(TRIM(EJES_NOMBRE)) = UPPER(TRIM($1)) 
       LIMIT 1`,
      [eje.EJES_NOMBRE]
    );

    if (existente.rows.length > 0) {
      throw new Error(`El eje "${eje.EJES_NOMBRE}" ya existe`);
    }

    // Obtener siguiente ID
    const { rows: rowsMax } = await pool.query(
      `SELECT COALESCE(MAX(EJES_ID), 0) + 1 AS nextId FROM EJES`
    );
    const nextId = rowsMax[0].nextid;

    // Insertar
    const query = `
      INSERT INTO EJES (EJES_ID, EJES_NOMBRE, EJES_DESCRIPCION)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      nextId,
      eje.EJES_NOMBRE,
      eje.EJES_DESCRIPCION
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  }

  // Listar todos los ejes
  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM EJES ORDER BY EJES_ID`);
    return rows;
  }

  // Buscar eje por nombre
  async buscarPorNombre(nombre) {
    const { rows } = await pool.query(
      `SELECT * FROM EJES WHERE UPPER(TRIM(EJES_NOMBRE)) = UPPER(TRIM($1))`,
      [nombre]
    );
    return rows;
  }

  // Buscar eje por ID
  async buscarPorId(id) {
    const { rows } = await pool.query(
      `SELECT * FROM EJES WHERE EJES_ID = $1`,
      [id]
    );
    return rows;
  }

  // Eliminar eje
  async eliminar(ejesId) {
    const { rowCount } = await pool.query(
      `DELETE FROM EJES WHERE EJES_ID = $1`,
      [ejesId]
    );
    return rowCount > 0;
  }

  // Actualizar eje
  async actualizar(eje) {
    const campos = [];
    const values = [];
    let i = 1;

    if (eje.EJES_NOMBRE) {
      campos.push(`EJES_NOMBRE = $${i}`);
      values.push(eje.EJES_NOMBRE.trim().toUpperCase());
      i++;
    }

    if (eje.EJES_DESCRIPCION) {
      campos.push(`EJES_DESCRIPCION = $${i}`);
      values.push(eje.EJES_DESCRIPCION.trim());
      i++;
    }

    if (campos.length === 0) return false; // nada que actualizar

    values.push(eje.EJES_ID); // para el WHERE
    const query = `UPDATE EJES SET ${campos.join(', ')} WHERE EJES_ID = $${i}`;

    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }

}
