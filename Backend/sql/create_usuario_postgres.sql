-- Minimal Postgres-compatible DDL to create the USUARIO table
-- Place this file in the project and run with psql to fix the "relation \"usuario\" does not exist" error.

CREATE TABLE IF NOT EXISTS usuario (
  usuario_id SERIAL PRIMARY KEY,
  usuario_nombreong VARCHAR(124) NOT NULL,
  usuario_user VARCHAR(124) NOT NULL UNIQUE,
  usuario_contrasena VARCHAR(256) NOT NULL,
  usuario_role VARCHAR(32) NOT NULL DEFAULT 'ong',
  usuari_descripcion VARCHAR(124) NOT NULL
);

-- Optional: create index on usuario_user for faster lookups
CREATE INDEX IF NOT EXISTS usuario_user_idx ON usuario (usuario_user);
