export class Validaciones {
  // Valida que el texto tenga letras, espacios, acentos, puntos, comas y signos básicos
  static soloLetras(texto) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.,;:()\-¡!¿?"']+$/;
    return regex.test(texto);
  }
static convertirAMayusculas(texto) {
  if (!texto) return "";
  return texto.toString().toUpperCase();
}

  // Valida que el texto solo tenga números
  static soloNumeros(texto) {
    const regex = /^[0-9]+$/;
    return regex.test(texto);
  }

  // Validadores específicos para inventario
  // Nombre de producto: permite letras, números, espacios y algunos signos básicos
  static validarProductoNombre(texto) {
    if (texto === undefined || texto === null) return false;
    const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.\-_,()]+$/;
    return regex.test(String(texto));
  }

  // Cantidad: entero >= 0
  static validarCantidad(texto) {
    if (texto === undefined || texto === null) return false;
    const regex = /^[0-9]+$/;
    try {
      return regex.test(String(texto)) && Number(String(texto)) >= 0;
    } catch (e) {
      return false;
    }
  }

  // Precio: número decimal >= 0
  static validarPrecio(texto) {
    if (texto === undefined || texto === null) return false;
    const regex = /^\d+(\.\d+)?$/;
    try {
      return regex.test(String(texto)) && Number(String(texto)) >= 0;
    } catch (e) {
      return false;
    }
  }

  // Validar formato de ID (ej. PROD-001, CAT-001, LOC-001)
  static validarIdFormato(id, tipo) {
    if (!id || !tipo) return false;
    const regex = new RegExp(`^${tipo}-\\d{3}$`);
    return regex.test(String(id));
  }

  static validarNombreCategoria(texto) {
    return Validaciones.soloLetras(texto);
  }

  static validarNombreUbicacion(texto) {
    return Validaciones.soloLetras(texto);
  }

  // Valida cédula ecuatoriana: 10 dígitos numéricos (simple check)
  static validarCedula(cedula) {
    if (!cedula) return false;
    const str = String(cedula).trim();
    const regex = /^\d{10}$/;
    return regex.test(str);
  }

  // Observación: requerido, máximo 100 caracteres
  static validarObservacion(texto) {
    if (texto === undefined || texto === null) return false;
    const s = String(texto).trim();
    return s.length > 0 && s.length <= 100;
  }

  // Sector: requerido, máximo 50 caracteres
  static validarSector(texto) {
    if (texto === undefined || texto === null) return false;
    const s = String(texto).trim();
    return s.length > 0 && s.length <= 50;
  }

  // ===== VALIDACIONES PARA FORMATO CARNET =====

  // Validar logo (buffer y MIME type)
  static validarLogo(logoBuffer, logoMime) {
    if (!logoBuffer || !logoMime) {
      return { valido: false, error: 'Logo es requerido', codigo: 'LOGO_REQUIRED' };
    }

    const validMimes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validMimes.includes(logoMime)) {
      return { valido: false, error: 'Formato de logo inválido. Solo PNG/JPG permitidos', codigo: 'INVALID_LOGO_FORMAT' };
    }

    // Validar tamaño (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (logoBuffer.length > maxSize) {
      return { valido: false, error: 'Logo demasiado grande. Máximo 2MB', codigo: 'LOGO_TOO_LARGE' };
    }

    return { valido: true };
  }

  // Validar nombre de directora
  static validarNombreDirectora(nombreDirectora) {
    if (!nombreDirectora || typeof nombreDirectora !== 'string') {
      return { valido: false, error: 'Nombre de directora es requerido', codigo: 'NOMBRE_DIRECTORA_REQUIRED' };
    }

    const trimmed = nombreDirectora.trim();
    if (trimmed.length === 0) {
      return { valido: false, error: 'Nombre de directora no puede estar vacío', codigo: 'NOMBRE_DIRECTORA_EMPTY' };
    }

    if (trimmed.length > 100) {
      return { valido: false, error: 'Nombre de directora demasiado largo (máximo 100 caracteres)', codigo: 'NOMBRE_DIRECTORA_TOO_LONG' };
    }

    return { valido: true, valor: trimmed };
  }

  // Validar ID de formato
  static validarFormatoId(formatoId) {
    if (!formatoId || typeof formatoId !== 'string') {
      return { valido: false, error: 'ID de formato es requerido', codigo: 'FORMATO_ID_REQUIRED' };
    }

    const trimmed = formatoId.trim();
    if (trimmed.length === 0) {
      return { valido: false, error: 'ID de formato no puede estar vacío', codigo: 'FORMATO_ID_EMPTY' };
    }

    return { valido: true, valor: trimmed };
  }

  // ===== VALIDACIONES PARA CARNET =====

  // Validar datos de socia para generar carnet
  static validarDatosSocia(sociaData = {}) {
    const validated = {};
    const errores = [];

    // Validar nombre (opcional para generar PDF)
    if (sociaData.nombre) {
      if (typeof sociaData.nombre !== 'string') {
        errores.push({ campo: 'nombre', error: 'Nombre debe ser texto', codigo: 'INVALID_NOMBRE' });
      } else {
        validated.nombre = sociaData.nombre.trim();
      }
    }

    // Validar cédula (opcional para generar PDF)
    if (sociaData.cedula) {
      if (typeof sociaData.cedula !== 'string') {
        errores.push({ campo: 'cedula', error: 'Cédula debe ser texto', codigo: 'INVALID_CEDULA' });
      } else {
        validated.cedula = sociaData.cedula.trim();
      }
    }

    // Validar nacionalidad (opcional para generar PDF)
    if (sociaData.nacionalidad) {
      if (typeof sociaData.nacionalidad !== 'string') {
        errores.push({ campo: 'nacionalidad', error: 'Nacionalidad debe ser texto', codigo: 'INVALID_NACIONALIDAD' });
      } else {
        validated.nacionalidad = sociaData.nacionalidad.trim();
      }
    }

    return { valido: errores.length === 0, datos: validated, errores };
  }
}

// Clase de error personalizada para validaciones
export class ValidationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}
