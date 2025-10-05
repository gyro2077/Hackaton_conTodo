// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  constructor() {
    // Configuramos el "transporter" de nodemailer una sola vez
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de Gmail
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación de Gmail
      },
    });
  }

  /**
   * Envía un correo de notificación cuando un reporte es aprobado.
   * @param {object} reporteData - Datos del reporte aprobado, ej: { ONG_NOMBRE, REPORTE_NOMBRE, MONTO }
   */
  async enviarCorreoAprobacion(reporteData) {
    try {
      const mailOptions = {
        from: `"Fundación Favorita" <${process.env.EMAIL_USER}>`,
        to: 'yeshuachiliquinga@gmail.com', // Correo de destino
        subject: `Aprobado Pago para ONG: ${reporteData.USUARIO_NOMBREONG}`,
        html: `
          <h3>Notificación de Aprobación de Pago</h3>
          <p>Se ha aprobado un desembolso para el siguiente reporte:</p>
          <ul>
            <li><strong>ONG:</strong> ${reporteData.USUARIO_NOMBREONG}</li>
            <li><strong>ID del Reporte:</strong> ${reporteData.REPORTEPROYECTO_ID}</li>
            <li><strong>Nombre del Reporte:</strong> ${reporteData.REPORTEPROYECTO_NOMBRE}</li>
            <li><strong>Aprobado por:</strong> ${reporteData.aprobadoPorNombre}</li>
          </ul>
          <p>El desembolso ha sido procesado en la plataforma de pagos.</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo de aprobación enviado:', info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo de aprobación:', error);
      // Aquí podrías agregar lógica para reintentar o notificar a un admin del error
    }
  }
}