import pool from '../config/db.js';

export class UsuarioRepository {
  async create(usuario) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(USUARIO_ID), 0) + 1 AS nextId FROM USUARIO`);
    const nextId = rowsMax[0].nextid;

    const query = `
      INSERT INTO USUARIO (USUARIO_ID, USUARIO_NOMBREONG, USUARIO_USER, USUARIO_CONTRASENA, USUARIO_ROLE, USUARI_DESCRIPCION)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [nextId, usuario.USUARIO_NOMBREONG, usuario.USUARIO_USER, usuario.USUARIO_CONTRASENA, usuario.USUARIO_ROLE || 'ong', usuario.USUARI_DESCRIPCION];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM USUARIO ORDER BY USUARIO_ID`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM USUARIO WHERE USUARIO_ID = $1`, [id]);
    return rows;
  }

  async buscarPorUsuario(user) {
    const { rows } = await pool.query(`SELECT * FROM USUARIO WHERE UPPER(TRIM(USUARIO_USER)) = UPPER(TRIM($1))`, [user]);
    return rows;
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM USUARIO WHERE USUARIO_ID = $1`, [id]);
    return rowCount > 0;
  }

  async actualizar(usuario) {
    const campos = [];
    const values = [];
    let i = 1;
  if (usuario.USUARIO_NOMBREONG) { campos.push(`USUARIO_NOMBREONG = $${i}`); values.push(usuario.USUARIO_NOMBREONG); i++; }
    if (usuario.USUARIO_USER) { campos.push(`USUARIO_USER = $${i}`); values.push(usuario.USUARIO_USER); i++; }
    if (usuario.USUARIO_CONTRASENA) { campos.push(`USUARIO_CONTRASENA = $${i}`); values.push(usuario.USUARIO_CONTRASENA); i++; }
  if (usuario.USUARIO_ROLE) { campos.push(`USUARIO_ROLE = $${i}`); values.push(usuario.USUARIO_ROLE); i++; }
    if (usuario.USUARI_DESCRIPCION) { campos.push(`USUARI_DESCRIPCION = $${i}`); values.push(usuario.USUARI_DESCRIPCION); i++; }

    if (campos.length === 0) return false;
    values.push(usuario.USUARIO_ID);
    const query = `UPDATE USUARIO SET ${campos.join(', ')} WHERE USUARIO_ID = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
