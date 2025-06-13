import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MateriaPrimaForm from '../features/MateriaPrima/Components/MateriaPrimaForm';
import CrearProceso from '../features/Proceso/CrearProceso';
import LoteForm from '../features/GestionLotes/components/LoteForm';

// Mock del módulo api
jest.mock('../shared/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    defaults: {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }
  }
}));

// Mock de los servicios
jest.mock('../features/MateriaPrima/services/materiaPrima.service', () => ({
  createMateriaPrima: jest.fn().mockResolvedValue({ data: {} }),
  getAllMateriasPrimas: jest.fn().mockResolvedValue([
    { IdMateriaPrima: 1, Nombre: 'Harina', Cantidad: 100 },
    { IdMateriaPrima: 2, Nombre: 'Azúcar', Cantidad: 50 }
  ])
}));

jest.mock('../features/Maquinas/services/maquinas.service', () => ({
  getAllMaquinas: jest.fn().mockResolvedValue([
    { IdMaquina: 1, Nombre: 'Balanza', ImagenUrl: 'url1' },
    { IdMaquina: 2, Nombre: 'Lavadora', ImagenUrl: 'url2' }
  ])
}));

jest.mock('../features/Proceso/services/proceso.service', () => ({
  createProceso: jest.fn().mockResolvedValue({ data: {} }),
  getAllMaquinas: jest.fn().mockResolvedValue([
    { IdMaquina: 1, Nombre: 'Balanza', ImagenUrl: 'url1' },
    { IdMaquina: 2, Nombre: 'Lavadora', ImagenUrl: 'url2' }
  ])
}));

jest.mock('../features/GestionLotes/services/lotes.service', () => ({
  createLote: jest.fn().mockResolvedValue({ data: {} }),
  getAllLotes: jest.fn().mockResolvedValue([])
}));

// Mock del servicio de autenticación
jest.mock('../shared/services/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getMe: jest.fn().mockResolvedValue({
    data: {
      id: 1,
      nombre: 'Usuario Test',
      cargo: 'Operador'
    }
  })
}));

// Importar los servicios mockeados
import * as materiaPrimaService from '../features/MateriaPrima/services/materiaPrima.service';
import * as procesoService from '../features/Proceso/services/proceso.service';
import * as lotesService from '../features/GestionLotes/services/lotes.service';
import * as authService from '../shared/services/auth.service';

// Mock de los hooks
jest.mock('../features/MateriaPrima/hooks/useMateriasPrimas', () => ({
  __esModule: true,
  default: () => ({
    data: [
      { IdMateriaPrima: 1, Nombre: 'Harina', Cantidad: 100 },
      { IdMateriaPrima: 2, Nombre: 'Azúcar', Cantidad: 50 }
    ],
    loading: false
  })
}));

// Helper para envolver componentes que necesitan Router y Auth
const renderWithAuth = (component) => {
  // Simular token en localStorage
  localStorage.setItem('token', 'mock-token');
  
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Pruebas de Aceptación', () => {
  beforeEach(() => {
    // Resetear mocks y localStorage antes de cada prueba
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Componente de Recepción de Materia Prima', () => {
    test('debe permitir registrar una nueva materia prima con todos los campos requeridos', async () => {
      renderWithAuth(<MateriaPrimaForm />);

      // Llenar el formulario
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { value: 'Harina de trigo 000' }
      });
      fireEvent.change(screen.getByLabelText(/fecha de recepción/i), {
        target: { value: '2024-03-20' }
      });
      fireEvent.change(screen.getByLabelText(/cantidad/i), {
        target: { value: '100.50' }
      });
      fireEvent.change(screen.getByLabelText(/proveedor/i), {
        target: { value: 'Molinos SRL' }
      });

      // Enviar el formulario usando el botón específico
      fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

      // Verificar que se llamó al servicio con los datos correctos
      await waitFor(() => {
        expect(materiaPrimaService.createMateriaPrima)
          .toHaveBeenCalledWith({
            Nombre: 'Harina de trigo 000',
            FechaRecepcion: '2024-03-20',
            Cantidad: 100.50,
            Proveedor: 'Molinos SRL'
          });
      });
    });

    test('debe mostrar error si faltan campos requeridos', async () => {
      renderWithAuth(<MateriaPrimaForm />);

      // Intentar enviar sin llenar campos usando el botón específico
      fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

      // Verificar que se muestran los mensajes de error
      expect(screen.getByLabelText(/nombre/i)).toBeInvalid();
      expect(screen.getByLabelText(/fecha de recepción/i)).toBeInvalid();
      expect(screen.getByLabelText(/cantidad/i)).toBeInvalid();
    });
  });

  describe('Componente de Registro de Procesos', () => {
    beforeEach(() => {
      // Mock de máquinas disponibles
      procesoService.getAllMaquinas.mockResolvedValue([
        { IdMaquina: 1, Nombre: 'Balanza', ImagenUrl: 'url1' },
        { IdMaquina: 2, Nombre: 'Lavadora', ImagenUrl: 'url2' }
      ]);
    });

    test('debe permitir crear un nuevo proceso con máquinas y variables', async () => {
      renderWithAuth(<CrearProceso />);

      // Esperar a que carguen las máquinas
      await waitFor(() => {
        expect(screen.getByText('Balanza')).toBeInTheDocument();
      });

      // Llenar nombre del proceso
      const nombreInput = screen.getByLabelText(/nombre del proceso/i);
      fireEvent.change(nombreInput, { target: { value: 'Proceso de prueba' } });

      // Seleccionar máquina
      const maquinaButton = screen.getByText('Balanza');
      fireEvent.click(maquinaButton);

      // Esperar a que se agregue la máquina
      await waitFor(() => {
        expect(screen.getByText('#1 – Balanza')).toBeInTheDocument();
      });

      // Agregar variables
      const agregarVariableButton = screen.getByText('➕ Agregar variable');
      fireEvent.click(agregarVariableButton);

      // Llenar datos de la variable
      const nombreInputVar = screen.getByPlaceholderText('Nombre');
      const minInputVar = screen.getByPlaceholderText('Min');
      const maxInputVar = screen.getByPlaceholderText('Max');

      fireEvent.change(nombreInputVar, { target: { value: 'Peso' } });
      fireEvent.change(minInputVar, { target: { value: '0' } });
      fireEvent.change(maxInputVar, { target: { value: '100' } });

      // Guardar proceso
      const guardarButton = screen.getByText('💾 Guardar proceso');
      fireEvent.click(guardarButton);

      // Verificar que se llamó al servicio
      await waitFor(() => {
        expect(procesoService.createProceso).toHaveBeenCalledWith({
          nombre: 'Proceso de prueba',
          maquinas: [
            {
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

    test('debe validar que cada máquina tenga al menos una variable', async () => {
      renderWithAuth(<CrearProceso />);

      // Esperar a que carguen las máquinas
      await waitFor(() => {
        expect(screen.getByText('Balanza')).toBeInTheDocument();
      });

      // Llenar nombre del proceso
      const nombreInput = screen.getByLabelText(/nombre del proceso/i);
      fireEvent.change(nombreInput, { target: { value: 'Proceso de prueba' } });

      // Seleccionar máquina
      const maquinaButton = screen.getByText('Balanza');
      fireEvent.click(maquinaButton);

      // Esperar a que se agregue la máquina
      await waitFor(() => {
        expect(screen.getByText('#1 – Balanza')).toBeInTheDocument();
      });

      // Intentar guardar sin variables
      const guardarButton = screen.getByText('💾 Guardar proceso');
      fireEvent.click(guardarButton);

      // Verificar mensaje de error
      await waitFor(() => {
        expect(screen.getByText(/la máquina #1 \(Balanza\) no tiene variables/i)).toBeInTheDocument();
      });
    });
  });

  describe('Componente de Creación de Lotes', () => {
    beforeEach(() => {
      // Mock de materias primas disponibles
      materiaPrimaService.getAllMateriasPrimas.mockResolvedValue([
        { IdMateriaPrima: 1, Nombre: 'Harina', Cantidad: 100 },
        { IdMateriaPrima: 2, Nombre: 'Azúcar', Cantidad: 50 }
      ]);
    });

    test('debe permitir crear un nuevo lote con materias primas', async () => {
      renderWithAuth(<LoteForm />);

      // Esperar a que carguen las materias primas
      await waitFor(() => {
        expect(screen.getByText('Harina')).toBeInTheDocument();
      });

      // Llenar nombre del lote
      fireEvent.change(screen.getByLabelText(/nombre/i), {
        target: { value: 'Lote de prueba' }
      });

      // Seleccionar materia prima usando el select
      const select = screen.getByRole('combobox', { name: /agregar materia prima/i });
      fireEvent.change(select, { target: { value: '1' } });

      // Establecer cantidad
      const cantidadInput = screen.getByPlaceholderText('Cantidad');
      fireEvent.change(cantidadInput, { target: { value: '25' } });

      // Establecer fecha
      fireEvent.change(screen.getByLabelText(/fecha creación/i), {
        target: { value: '2024-03-20' }
      });

      // Crear lote
      fireEvent.click(screen.getByRole('button', { name: /crear lote/i }));

      // Verificar que se llamó al servicio con los datos correctos
      await waitFor(() => {
        expect(lotesService.createLote)
          .toHaveBeenCalledWith(expect.objectContaining({
            Nombre: 'Lote de prueba',
            FechaCreacion: '2024-03-20',
            Estado: 'Pendiente',
            MateriasPrimas: expect.arrayContaining([
              expect.objectContaining({
                IdMateriaPrima: 1,
                Cantidad: 25
              })
            ])
          }));
      });
    });

    test('debe validar que no se exceda la cantidad disponible de materia prima', async () => {
      renderWithAuth(<LoteForm />);

      // Esperar a que carguen las materias primas
      await waitFor(() => {
        expect(screen.getByText('Harina')).toBeInTheDocument();
      });

      // Seleccionar materia prima usando el select
      const select = screen.getByRole('combobox', { name: /agregar materia prima/i });
      fireEvent.change(select, { target: { value: '1' } });

      // Intentar establecer una cantidad mayor a la disponible
      const cantidadInput = screen.getByPlaceholderText('Cantidad');
      fireEvent.change(cantidadInput, { target: { value: '150' } });

      // Verificar que se muestra la cantidad disponible
      expect(screen.getByText(/disponible: 100/i)).toBeInTheDocument();
    });
  });
}); 