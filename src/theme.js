import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007c64', // Verde institucional
      contrastText: '#fff',
    },
    // Puedes personalizar otros colores aquí
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

export default theme; 