import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Button } from '@mui/material';
import { getAllMateriaPrimaBase } from '../services/materiaPrima.service';

export default function MateriaPrimaBaseList({ refresh, onShowLog }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllMateriaPrimaBase();
      setData(res);
    } catch (err) {
      setError('Error al cargar materias primas base');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  // Asegurarse de que data sea siempre un array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Box sx={{ width: '100%', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} fontWeight={600} align="center">
        Materias Primas Base Registradas
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={0} sx={{ boxShadow: 'none', bgcolor: 'transparent', width: '100%' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="center">Registros</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {safeData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No hay materias primas base registradas.</TableCell>
                </TableRow>
              ) : safeData.map(row => (
                <TableRow key={row.IdMateriaPrimaBase}>
                  <TableCell>{row.Nombre}</TableCell>
                  <TableCell>{row.Unidad}</TableCell>
                  <TableCell align="right">{row.Cantidad}</TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      onClick={() => onShowLog && onShowLog(row)}
                      sx={{ minWidth: 120 }}
                    >
                      Ver Registro
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
} 