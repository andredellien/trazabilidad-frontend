import React, { useEffect, useState } from "react";
import { getLotesCertificados } from "../services/lotes.service";
import { getAlmacenajesByLote, createAlmacenaje } from "../services/almacenaje.service";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { Warehouse as WarehouseIcon } from "@mui/icons-material";
import { formatDate } from '../../../shared/utils/formatDate';

const AlmacenajeSection = () => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ubicacion, setUbicacion] = useState("");
  const [condicion, setCondicion] = useState("");
  const [almacenajes, setAlmacenajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const data = await getLotesCertificados();
      setLotes(data);
    } catch (e) {
      setError("Error al cargar lotes certificados");
    }
    setLoading(false);
  };

  const handleSelectLote = async (lote) => {
    setSelectedLote(lote);
    setShowModal(true);
    setUbicacion("");
    setCondicion("");
    setSuccess("");
    setError("");
    try {
      const almacenajesPrevios = await getAlmacenajesByLote(lote.IdLote);
      setAlmacenajes(almacenajesPrevios);
    } catch {
      setAlmacenajes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createAlmacenaje({
        IdLote: selectedLote.IdLote,
        Ubicacion: ubicacion,
        Condicion: condicion,
      });
      setSuccess("Almacenaje registrado correctamente");
      fetchLotes();
      const almacenajesPrevios = await getAlmacenajesByLote(selectedLote.IdLote);
      setAlmacenajes(almacenajesPrevios);
      setUbicacion("");
      setCondicion("");
    } catch {
      setError("Error al registrar almacenaje");
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>Almacenaje de Lotes Certificados</Typography>
      {loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
      {error && <Typography color="error" mb={2}>{error}</Typography>}
      <Paper sx={{ width: '100%', overflowX: 'auto', mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote.IdLote} hover>
                <TableCell>{lote.IdLote}</TableCell>
                <TableCell>{lote.Nombre}</TableCell>
                <TableCell>{formatDate(lote.FechaCreacion)}</TableCell>
                <TableCell>{lote.NombreCliente}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Almacenar">
                    <IconButton color="primary" onClick={() => handleSelectLote(lote)}>
                      <WarehouseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={showModal && !!selectedLote} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Almacenaje para Lote #{selectedLote?.IdLote}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Ubicación"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              required
              fullWidth
              margin="normal"
              placeholder="Ej: Depósito Central"
            />
            <TextField
              label="Condición"
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              required
              fullWidth
              margin="normal"
              placeholder="Ej: Seco y ventilado"
            />
            {success && <Typography color="success.main" mt={1}>{success}</Typography>}
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            <DialogActions sx={{ mt: 1 }}>
              <Button onClick={() => setShowModal(false)} color="secondary" variant="outlined">Cancelar</Button>
              <Button type="submit" color="primary" variant="contained" disabled={loading}>Guardar</Button>
            </DialogActions>
          </Box>
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Almacenajes previos</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {almacenajes.length === 0 && <Typography component="li">No hay registros previos.</Typography>}
              {almacenajes.map((a) => (
                <li key={a.IdAlmacenaje}>
                  <b>{formatDate(a.FechaAlmacenaje)}</b> - {a.Ubicacion} ({a.Condicion})
                </li>
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AlmacenajeSection; 