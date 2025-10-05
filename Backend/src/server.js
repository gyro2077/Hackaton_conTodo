// src/server.js
import app from './app.js';
import { SchedulerService } from './services/schedulerService.js'; // <- AÑADIR

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(` Servidor escuchando en el puerto ${PORT}`);
  
  // Inicia el programador de tareas una vez que el servidor está listo
  const scheduler = new SchedulerService(); // <- AÑADIR
  scheduler.startReportReminders();      // <- AÑADIR
});

export default server;