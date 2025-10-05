// src/services/analysisService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class AnalysisService {
  async analizarCoherenciaYResumir(datosReporte) {
    try {
      // ✔️ SOLUCIÓN: Cambiamos el nombre del modelo a la versión más reciente y estable
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // 1. Convertimos los datos del reporte a un formato legible para la IA
      const datosFormateados = `
        - Nombre del Reporte: ${datosReporte.REPORTEPROYECTO_NOMBRE}
        - Acciones Destacadas: ${datosReporte.REPORTEPROYECTO_ACCIONESDESTACADAS}
        - Primer Hito: ${datosReporte.REPORTEPROYECTO_PRIMERHITO}
        - Segundo Hito: ${datosReporte.REPORTEPROYECTO_SEGUNDOHITO}
        - Tercer Hito: ${datosReporte.REPORTEPROYECTO_TERCERHITO}
        - Descripción General: ${datosReporte.REPORTEPROYECTO_DESCRIPCION}
      `;

      // 2. Creamos el prompt (la instrucción) para Gemini
      const prompt = `
        Eres un analista experto de proyectos para una fundación que evalúa reportes de ONGs.
        Basado en los siguientes datos de un reporte que acaban de ingresar:
        ${datosFormateados}

        Por favor, realiza dos tareas y responde únicamente con un objeto JSON válido:
        1.  **Análisis de Coherencia**: Evalúa si los hitos y acciones descritas son coherentes y realistas. Proporciona una breve evaluación en un campo llamado "evaluacionCoherencia".
        2.  **Resumen Ejecutivo**: Genera un resumen de 2 o 3 frases de los logros principales descritos en el reporte. Ponlo en un campo llamado "resumenEjecutivo".

        El formato de tu respuesta debe ser este JSON:
        {
          "evaluacionCoherencia": "...",
          "resumenEjecutivo": "..."
        }
      `;

      // 3. Hacemos la llamada a la API
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // 4. Limpiamos y parseamos la respuesta JSON
      const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
      return JSON.parse(cleanedJsonString);

    } catch (error) {
      console.error("Error al analizar con Gemini:", error);
      // Si Gemini falla, devolvemos un objeto de error para no romper el flujo
      return {
        evaluacionCoherencia: "Error al procesar el análisis.",
        resumenEjecutivo: "No se pudo generar el resumen."
      };
    }
  }
}