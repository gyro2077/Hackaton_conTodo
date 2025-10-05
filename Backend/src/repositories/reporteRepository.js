import pool from '../config/db.js';

export class ReporteRepository {
  async create(reporte) {
    const { rows: rowsMax } = await pool.query(`SELECT COALESCE(MAX(REPORTEPROYECTO_ID), 0) + 1 AS nextId FROM REPORTEPROYECTO`);
    const nextId = rowsMax[0].nextid;

    const query = `
      INSERT INTO REPORTEPROYECTO (REPORTEPROYECTO_ID, USUARIO_ID, REPORTEPROYECTO_NOMBRE, REPORTEPROYECTO_FECHAINICIO, REPORTEPROYECTO_FECHAFIN, REPORTEPROYECTO_PERIODOSUBIRREPORTES, REPORTEPROYECTO_ACCIONESDESTACADAS, REPORTEPROYECTO_PRIMERHITO, REPORTEPROYECTO_SEGUNDOHITO, REPORTEPROYECTO_TERCERHITO, REPORTEPROYECTO_NOMBREHITO, REPORTEPROYECTO_LUGAR, REPORTEPROYECTO_DESCRIPCION, REPORTEPROYECTO_INDICADORLARGOPLAZO, REPORTEPROYECTO_MATERIALAUDIOVISUAL, REPORTEPROYECTO_INDICADORPREVENCION, REPORTEPROYECTO_ESTADO)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const values = [
      nextId,
      reporte.USUARIO_ID, 
      reporte.REPORTEPROYECTO_NOMBRE,
      reporte.REPORTEPROYECTO_FECHAINICIO,
      reporte.REPORTEPROYECTO_FECHAFIN,
      reporte.REPORTEPROYECTO_PERIODOSUBIRREPORTES,
      reporte.REPORTEPROYECTO_ACCIONESDESTACADAS,
      reporte.REPORTEPROYECTO_PRIMERHITO,
      reporte.REPORTEPROYECTO_SEGUNDOHITO,
      reporte.REPORTEPROYECTO_TERCERHITO,
      reporte.REPORTEPROYECTO_NOMBREHITO,
      reporte.REPORTEPROYECTO_LUGAR,
      reporte.REPORTEPROYECTO_DESCRIPCION,
      reporte.REPORTEPROYECTO_INDICADORLARGOPLAZO,
      reporte.REPORTEPROYECTO_MATERIALAUDIOVISUAL,
      reporte.REPORTEPROYECTO_INDICADORPREVENCION,
      reporte.REPORTEPROYECTO_ESTADO
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async listarTodos() {
    const { rows } = await pool.query(`SELECT * FROM REPORTEPROYECTO ORDER BY REPORTEPROYECTO_ID`);
    return rows;
  }

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT * FROM REPORTEPROYECTO WHERE REPORTEPROYECTO_ID = $1`, [id]);
    return rows;
  }

  async eliminar(id) {
    const { rowCount } = await pool.query(`DELETE FROM REPORTEPROYECTO WHERE REPORTEPROYECTO_ID = $1`, [id]);
    return rowCount > 0;
  }
  
  async aprobar(id, usuarioId) {
    const query = `
      UPDATE REPORTEPROYECTO
      SET 
        REPORTEPROYECTO_ESTADO = 'Aprobado',
        REPORTEPROYECTO_FECHAAPROBACION = NOW(),
        REPORTEPROYECTO_APROBADOPOR = $2
      WHERE REPORTEPROYECTO_ID = $1
      RETURNING *
    `;
    // RETURNING * nos devuelve el reporte actualizado, lo cual es muy útil.
    const { rows } = await pool.query(query, [id, usuarioId]);
    return rows[0];
  }


  async actualizar(reporte) {
    const campos = [];
    const values = [];
    let i = 1;

    const maybeAdd = (field, val) => { if (val !== undefined) { campos.push(`${field} = $${i}`); values.push(val); i++; } };

    maybeAdd('USUARIO_ID', reporte.USUARIO_ID);
    maybeAdd('REPORTEPROYECTO_NOMBRE', reporte.REPORTEPROYECTO_NOMBRE);
    maybeAdd('REPORTEPROYECTO_FECHAINICIO', reporte.REPORTEPROYECTO_FECHAINICIO);
    maybeAdd('REPORTEPROYECTO_FECHAFIN', reporte.REPORTEPROYECTO_FECHAFIN);
    maybeAdd('REPORTEPROYECTO_PERIODOSUBIRREPORTES', reporte.REPORTEPROYECTO_PERIODOSUBIRREPORTES);
    maybeAdd('REPORTEPROYECTO_ACCIONESDESTACADAS', reporte.REPORTEPROYECTO_ACCIONESDESTACADAS);
    maybeAdd('REPORTEPROYECTO_PRIMERHITO', reporte.REPORTEPROYECTO_PRIMERHITO);
    maybeAdd('REPORTEPROYECTO_SEGUNDOHITO', reporte.REPORTEPROYECTO_SEGUNDOHITO);
    maybeAdd('REPORTEPROYECTO_TERCERHITO', reporte.REPORTEPROYECTO_TERCERHITO);
    maybeAdd('REPORTEPROYECTO_NOMBREHITO', reporte.REPORTEPROYECTO_NOMBREHITO);
    maybeAdd('REPORTEPROYECTO_LUGAR', reporte.REPORTEPROYECTO_LUGAR);
    maybeAdd('REPORTEPROYECTO_DESCRIPCION', reporte.REPORTEPROYECTO_DESCRIPCION);
    maybeAdd('REPORTEPROYECTO_INDICADORLARGOPLAZO', reporte.REPORTEPROYECTO_INDICADORLARGOPLAZO);
    maybeAdd('REPORTEPROYECTO_MATERIALAUDIOVISUAL', reporte.REPORTEPROYECTO_MATERIALAUDIOVISUAL);
    maybeAdd('REPORTEPROYECTO_INDICADORPREVENCION', reporte.REPORTEPROYECTO_INDICADORPREVENCION);
    maybeAdd('REPORTEPROYECTO_ESTADO', reporte.REPORTEPROYECTO_ESTADO);

    if (campos.length === 0) return false;
    values.push(reporte.REPORTEPROYECTO_ID);
    const query = `UPDATE REPORTEPROYECTO SET ${campos.join(', ')} WHERE REPORTEPROYECTO_ID = $${i}`;
    const { rowCount } = await pool.query(query, values);
    return rowCount > 0;
  }
}
