import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Button } from '@mui/material';
import { getAllMateriasPrimas } from '../services/materiaPrima.service';

export default function RecepcionMateriaPrimaList({ onRecepcionar, refresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllMateriasPrimas();
      setData(Array.isArray(res) ? res.filter(mp => mp.Estado === 'solicitado') : []);
    } catch (err) {
      setError('Error al cargar solicitudes de materia prima');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" mb={2} fontWeight={600} align="center">
        Recepción de Materia Prima (Solicitudes Pendientes)
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Fecha Solicitud</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No hay solicitudes pendientes.</TableCell>
                </TableRow>
              ) : data.map(row => (
                <TableRow key={row.IdMateriaPrima}>
                  <TableCell>{row.Nombre}</TableCell>
                  <TableCell>{row.Cantidad}</TableCell>
                  <TableCell>{row.Unidad}</TableCell>
                  <TableCell>{row.Proveedor}</TableCell>
                  <TableCell>{row.FechaRecepcion ? new Date(row.FechaRecepcion).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="primary" size="small" onClick={() => onRecepcionar(row)}>
                      Recepcionar
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