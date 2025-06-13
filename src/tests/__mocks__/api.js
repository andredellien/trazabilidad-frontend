const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn()
    },
    response: {
      use: jest.fn(),
      eject: jest.fn()
    }
  }
};

// Mock implementation for common API calls
mockAxios.get.mockImplementation((url) => {
  if (url.includes('/maquinas')) {
    return Promise.resolve({
      data: [
        {
          IdMaquina: 1,
          Nombre: 'Balanza',
          ImagenUrl: 'url1'
        }
      ]
    });
  }
  return Promise.resolve({ data: {} });
});

export default mockAxios; 