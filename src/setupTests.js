import '@testing-library/jest-dom';

// Extender las expectativas de Jest
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Mock Vite's import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:3000'
    }
  }
}; 