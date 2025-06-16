/**
 * Valida que un proceso tenga la estructura correcta y datos válidos
 */
export function validarProceso(proceso) {
  if (!proceso.nombre || !proceso.maquinas || !Array.isArray(proceso.maquinas)) {
    return false;
  }

  if (proceso.maquinas.length === 0) {
    return false;
  }

  for (const maquina of proceso.maquinas) {
    if (!maquina.IdMaquina || !maquina.nombre || !maquina.imagen || !Array.isArray(maquina.variables)) {
      return false;
    }

    const validacionVariables = validarVariables(maquina.variables);
    if (!validacionVariables.esValido) {
      return false;
    }
  }

  return true;
}

/**
 * Valida un array de variables de proceso
 */
export function validarVariables(variables) {
  const errores = [];

  for (const variable of variables) {
    if (!variable.nombre || variable.nombre.trim() === '') {
      errores.push('Nombre de variable vacío');
    }

    if (variable.min === null || variable.max === null || 
        variable.min === undefined || variable.max === undefined || 
        isNaN(variable.min) || isNaN(variable.max)) {
      errores.push('Valores min/max deben ser números');
    }

    if (parseFloat(variable.min) > parseFloat(variable.max)) {
      errores.push('El valor mínimo no puede ser mayor que el máximo');
    }
  }

  return {
    esValido: errores.length === 0,
    errores
  };
}

/**
 * Formatea y limpia los datos del proceso antes de enviarlos al backend
 */
export function formatearPayload(datos) {
  return {
    nombre: datos.nombre.trim(),
    maquinas: datos.maquinas.map(maquina => ({
      ...maquina,
      nombre: maquina.nombre.trim(),
      variables: maquina.variables.map(variable => ({
        nombre: variable.nombre.trim(),
        min: parseFloat(variable.min),
        max: parseFloat(variable.max)
      }))
    }))
  };
} 