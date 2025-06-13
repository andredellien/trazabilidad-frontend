import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../features/Auth/components/LoginForm';

// Mock window.alert to avoid jsdom errors
beforeAll(() => {
  window.alert = jest.fn();
});

// Mock the API module
jest.mock('../../shared/services/api', () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      token: 'test-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
    }
  }),
  defaults: {
    headers: {}
  }
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should render login form and handle successful login', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Check if form elements are rendered
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'testpass' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Wait for the login process to complete
    await waitFor(() => {
      // Check if token was stored
      expect(localStorage.getItem('token')).toBe('test-token');
      
      // Check if navigation occurred
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  test('should show error message on failed login', async () => {
    // Mock API to reject
    require('../../shared/services/api').post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrongpass' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('should validate required fields before submission', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Try to submit without filling any fields
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Check if form validation prevents submission
    await waitFor(() => {
      expect(screen.getByLabelText(/usuario/i)).toBeInvalid();
      expect(screen.getByLabelText(/contraseña/i)).toBeInvalid();
    });

    // Verify that API was not called
    expect(require('../../shared/services/api').post).not.toHaveBeenCalled();
    
    // Verify that no navigation occurred
    expect(mockNavigate).not.toHaveBeenCalled();
  });
}); 