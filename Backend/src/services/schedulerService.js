// src/services/schedulerService.js
import cron from 'node-cron';
import { UsuarioRepository } from '../repositories/usuarioRepository.js';
import { EmailService } from './emailService.js';

const usuarioRepo = new UsuarioRepository();
const emailService = new EmailService();

export class SchedulerService {
  startReportReminders() {
    console.log('Scheduler de recordatorios iniciado.');

    // Se ejecuta cada 20 segundos
    cron.schedule('*/20 * * * * *', async () => {
      console.log('Ejecutando tarea programada: enviando recordatorios...');
      
      try {
        const todosLosUsuarios = await usuarioRepo.listarTodos();
        const ongs = todosLosUsuarios.filter(u => u.usuario_role === 'ong');

        console.log(`Se encontraron ${ongs.length} ONGs para notificar.`);

        // Enviamos un correo a cada una (sin validar el formato del email)
        for (const ong of ongs) {
          // La validación 'if (ong.usuario_user.includes('@'))' ha sido removida.
          await emailService.enviarRecordatorioReporte(ong);
        }

      } catch (error) {
        console.error('Error en la tarea programada de recordatorios:', error);
      }
    });
  }
}