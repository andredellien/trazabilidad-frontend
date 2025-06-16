import { validarProceso, formatearPayload, validarVariables } from '../../features/Proceso/utils/procesoUtils';

describe('Pruebas Unitarias de Proceso', () => {
  // Test 1: Validación de proceso básico
  test('validarProceso debe retornar true para un proceso válido', () => {
    const procesoValido = {
      nombre: 'Proceso de prueba',
      maquinas: [
        {
          IdMaquina: 1,
          numero: 1,
          nombre: 'Balanza',
          imagen: 'url1',
          variables: [
            {
              nombre: 'Peso',
              min: 0,
              max: 100
            }
          ]
        }
      ]
    };

    expect(validarProceso(procesoValido)).toBe(true);
  });

  // Test 2: Validación de variables
  test('validarVariables debe detectar variables inválidas', () => {
    const variablesInvalidas = [
      { nombre: 'Peso', min: 100, max: 0 }, // min > max
      { nombre: '', min: 0, max: 100 },     // nombre vacío
      { nombre: 'Temp', min: null, max: 50 } // min es null
    ];

    const resultado = validarVariables(variablesInvalidas);
    expect(resultado.esValido).toBe(false);
    expect(resultado.errores).toHaveLength(3);
  });

  // Test 3: Formateo de payload
  test('formatearPayload debe transformar correctamente los datos', () => {
    const datosEntrada = {
      nombre: '  Proceso Test  ',
      maquinas: [
        {
          IdMaquina: 1,
          numero: 1,
          nombre: 'Balanza',
          imagen: 'url1',
          variables: [
            {
              nombre: '  Peso  ',
              min: '0',
              max: '100'
            }
          ]
        }
      ]
    };

    const resultado = formatearPayload(datosEntrada);
    
    expect(resultado).toEqual({
      nombre: 'Proceso Test',
      maquinas: [
        {
          IdMaquina: 1,
          numero: 1,
          nombre: 'Balanza',
          imagen: 'url1',
          variables: [
            {
              nombre: 'Peso',
              min: 0,
              max: 100
            }
          ]
        }
      ]
    });
  });
}); 