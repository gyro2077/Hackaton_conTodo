import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pool from './config/db.js';
import routes from './routes/index.js';
import { swaggerUi, swaggerSpec } from './swagger.js';
import ejeRoutes from './routes/ejeRoutes.js';

dotenv.config();

const app = express();

// Middleware
// Middleware CORS seguro
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173',
  'http://localhost:5174'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true // si usas cookies/sesiones, de lo contrario puedes omitir
};

app.use(cors(corsOptions));

// Eliminar encabezado 'X-Powered-By' para no divulgar versión de Express
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para verificar conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    next();
  } catch (error) {
    console.error('Error de conexión a DB:', error);
    res.status(500).json({ error: 'Error de conexión a base de datos' });
  }
});

// Rutas
app.use('/api', routes);





// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta base
app.get('/', (req, res) => {
  res.send('Backend de gestión de socias PEFAST activo');
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de errores generales
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;