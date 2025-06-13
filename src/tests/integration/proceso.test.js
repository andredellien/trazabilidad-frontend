import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CrearProceso from '../../features/Proceso/CrearProceso';
import LoteForm from '../../features/GestionLotes/components/LoteForm';
import ProcesoTransformacion from '../../features/ProcesoTransformacion/ProcesoTransformacion';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ idLote: '1' })
}));

// Mock de los servicios necesarios
jest.mock('../../shared/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn((url) => {
      if (url === '/lote/1') {
        return Promise.resolve({ data: { 
          IdLote: 1, 
          IdProceso: 1,
          Nombre: 'Lote de prueba',
          Estado: 'En proceso'
        }});
      }
      if (url === '/proceso-transformacion/lote/1') {
        return Promise.resolve({ data: [
          { 
            Numero: 1, 
            Nombre: 'Balanza', 
            Imagen: 'url1',
            variables: [
              { nombre: 'peso', min: 0, max: 100 },
              { nombre: 'grosor', min: 2, max: 5 }
            ]
          }
        ]});
      }
      return Promise.resolve({ data: [] });
    }),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
      headers: {
        Authorization: 'Bearer mock-token'
      }
    }
  }
}));

// Mock de los servicios específicos
jest.mock('../../features/Maquinas/services/maquinas.service', () => ({
  getAllMaquinas: jest.fn().mockResolvedValue([
    { IdMaquina: 1, Nombre: 'Balanza', ImagenUrl: 'url1' },
    { IdMaquina: 2, Nombre: 'Lavadora', ImagenUrl: 'url2' }
  ])
}));

jest.mock('../../features/Proceso/services/proceso.service', () => ({
  createProceso: jest.fn().mockResolvedValue({ data: { IdProceso: 1 } }),
  getProcesoById: jest.fn().mockResolvedValue({
    data: {
      IdProceso: 1,
      Nombre: 'Proceso Test',
      Maquinas: [
        {
          IdMaquina: 1,
          Nombre: 'Balanza',
          Imagen: 'url1',
          variables: [
            { nombre: 'Peso', min: 0, max: 100 }
          ]
        }
      ]
    }
  })
}));

jest.mock('../../features/GestionLotes/services/lotes.service', () => ({
  createLote: jest.fn().mockResolvedValue({ data: { IdLote: 1 } }),
  getAllLotes: jest.fn().mockResolvedValue([
    { IdLote: 1, Nombre: 'Lote Test', Estado: 'Pendiente' }
  ])
}));

jest.mock('../../features/MateriaPrima/services/materiaPrima.service', () => ({
  getAllMateriasPrimas: jest.fn().mockResolvedValue([
    { IdMateriaPrima: 1, Nombre: 'Harina', Cantidad: 100 }
  ])
}));

// Helper para envolver componentes que necesitan Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Pruebas de Integración', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Integración Proceso-Máquinas-Variables
  test('debe permitir crear un proceso completo con máquinas y variables', async () => {
    renderWithRouter(<CrearProceso />);

    // 1. Esperar a que carguen las máquinas
    await waitFor(() => {
      expect(screen.getByText('Balanza')).toBeInTheDocument();
    });

    // 2. Crear proceso con máquina y variables
    fireEvent.change(screen.getByLabelText(/nombre del proceso/i), {
      target: { value: 'Proceso de prueba' }
    });

    fireEvent.click(screen.getByText('Balanza'));

    // 3. Agregar variable
    fireEvent.click(screen.getByText('➕ Agregar variable'));
    
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Peso' }
    });
    fireEvent.change(screen.getByPlaceholderText('Min'), {
      target: { value: '0' }
    });
    fireEvent.change(screen.getByPlaceholderText('Max'), {
      target: { value: '100' }
    });

    // 4. Guardar proceso
    fireEvent.click(screen.getByText('💾 Guardar proceso'));

    // 5. Verificar que se creó correctamente
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/procesos');
    });
  });

  // Test 2: Integración Lote-MateriaPrima-Proceso
  test('debe permitir crear un lote con materia prima y asignarle un proceso', async () => {
    renderWithRouter(<LoteForm />);

    // 1. Esperar a que carguen las materias primas
    await waitFor(() => {
      expect(screen.getByText('Harina')).toBeInTheDocument();
    });

    // 2. Crear lote con materia prima
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Lote de prueba' }
    });

    const select = screen.getByRole('combobox', { name: /agregar materia prima/i });
    fireEvent.change(select, { target: { value: '1' } });

    fireEvent.change(screen.getByPlaceholderText('Cantidad'), {
      target: { value: '50' }
    });

    fireEvent.change(screen.getByLabelText(/fecha creación/i), {
      target: { value: '2024-03-20' }
    });

    // 3. Crear lote
    fireEvent.click(screen.getByRole('button', { name: /crear lote/i }));

    // 4. Verificar que se creó correctamente
    await waitFor(() => {
      expect(screen.getByText(/lote creado correctamente/i)).toBeInTheDocument();
    });
  });

  // Test 3: Integración ProcesoTransformacion-Evaluacion-Certificados
  test('debe permitir completar un proceso de transformación y generar certificado', async () => {
    // Mock window.alert
    const originalAlert = window.alert;
    window.alert = jest.fn();

    // Mock the form submission response
    const mockApi = require('../../shared/services/api').default;
    mockApi.post.mockImplementation((url) => {
      if (url.includes('/proceso-transformacion/')) {
        return Promise.resolve({ 
          data: { 
            message: 'Formulario guardado correctamente',
            cumple: true 
          }
        });
      }
      if (url.includes('/proceso-evaluacion/finalizar/')) {
        return Promise.resolve({ 
          data: { 
            message: 'Proceso finalizado correctamente',
            motivo: 'Todos los estándares cumplidos'
          }
        });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithRouter(<ProcesoTransformacion />);

    // 1. Esperar a que termine de cargar el lote
    await waitFor(() => {
      expect(screen.queryByText('Cargando lote...')).not.toBeInTheDocument();
    });

    // 2. Verificar que se muestra el título correcto
    expect(screen.getByText(/Proceso de Transformación – Lote #1/i)).toBeInTheDocument();

    // 3. Esperar a que se carguen las máquinas
    const balanza = await screen.findByText('Balanza');
    expect(balanza).toBeInTheDocument();

    // 4. Simular la navegación al formulario de la máquina
    await act(async () => {
      fireEvent.click(balanza);
    });

    // 5. Verificar que se navegó al formulario
    expect(mockNavigate).toHaveBeenCalledWith('/proceso/1/maquina/1');

    // 6. Simular la finalización del proceso
    await act(async () => {
      fireEvent.click(screen.getByText(/finalizar proceso/i));
    });

    // 7. Verificar que se mostró el alert
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Proceso finalizado')
    );

    // 8. Verificar que se navegó al certificado
    expect(mockNavigate).toHaveBeenCalledWith('/certificado/1');

    // Restore original alert
    window.alert = originalAlert;
  });
}); 