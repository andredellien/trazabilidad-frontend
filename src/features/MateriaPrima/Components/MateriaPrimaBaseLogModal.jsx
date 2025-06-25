import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert, Typography } from '@mui/material';
import { getLogMateriaPrimaBase } from '../services/materiaPrima.service';

export default function MateriaPrimaBaseLogModal({ open, onClose, materiaPrimaBase }) {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && materiaPrimaBase) {
      setLoading(true);
      setError('');
      getLogMateriaPrimaBase(materiaPrimaBase.IdMateriaPrimaBase)
        .then(setLog)
        .catch(() => setError('Error al cargar el log de movimientos.'))
        .finally(() => setLoading(false));
    } else {
      setLog([]);
      setError('');
    }
  }, [open, materiaPrimaBase]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Log de movimientos - {materiaPrimaBase?.Nombre}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : log.length === 0 ? (
          <Typography variant="body2">No hay movimientos registrados para esta materia prima base.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Observación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.Fecha ? new Date(item.Fecha).toLocaleString() : ''}</TableCell>
                  <TableCell>{item.TipoMovimiento}</TableCell>
                  <TableCell>{item.Cantidad}</TableCell>
                  <TableCell>{item.Unidad || '-'}</TableCell>
                  <TableCell>{item.Descripcion || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
} 