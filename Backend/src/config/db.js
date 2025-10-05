import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Configurar el pool con variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "fundaciones",
  max: 10,           // máximo de conexiones
  idleTimeoutMillis: 30000, // tiempo de espera antes de liberar conexión
});

export default pool;
