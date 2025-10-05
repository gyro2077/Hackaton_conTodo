// services/paymentService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class PaymentService {
  constructor() {
    this.pluxApi = axios.create({
      baseURL: process.env.PLUX_API_URL, // URL base de la API de Plux (sandbox)
      headers: {
        'Authorization': `Bearer ${process.env.PLUX_API_KEY}`, // Tu clave de API de Plux
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Inicia el proceso de pago en la plataforma Plux.
   * @param {object} reporteData - Datos del reporte para el pago
   */
  async iniciarPagoPlux(reporteData) {
    try {
      const payload = {
        // ATENCIÓN: Este es un EJEMPLO. Debes adaptar el payload
        // a lo que la documentación de la API de Plux requiera.
        amount: reporteData.monto,
        description: `Pago para ONG ${reporteData.USUARIO_NOMBREONG} por reporte ${reporteData.REPORTEPROYECTO_ID}`,
        beneficiary_account: reporteData.cuentaBancariaONG,
        reference_id: reporteData.REPORTEPROYECTO_ID,
      };

      console.log('Enviando solicitud de pago a Plux:', payload);
      const response = await this.pluxApi.post('/payments', payload);
      console.log('Respuesta de Plux API:', response.data);
      
      return response.data;

    } catch (error) {
      console.error('Error al iniciar el pago con Plux:', error.response ? error.response.data : error.message);
      // Manejo de errores importante aquí
    }
  }
}