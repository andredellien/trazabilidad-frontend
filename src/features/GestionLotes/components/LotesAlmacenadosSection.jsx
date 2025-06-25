import React, { useEffect, useState } from "react";
import { getLotesAlmacenados } from "../services/lotes.service";
import { getAlmacenajesByLote } from "../services/almacenaje.service";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, CircularProgress } from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";

const LotesAlmacenadosSection = () => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [almacenajes, setAlmacenajes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLotesAlmacenados();
      setLotes(data);
    } catch (e) {
      setError("Error al cargar lotes almacenados");
    }
    setLoading(false);
  };

  const handleSelectLote = async (lote) => {
    setSelectedLote(lote);
    setShowModal(true);
    setError("");
    try {
      const almacenajesPrevios = await getAlmacenajesByLote(lote.IdLote);
      setAlmacenajes(almacenajesPrevios);
    } catch {
      setAlmacenajes([]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>Lotes Almacenados</Typography>
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
                <TableCell>{lote.FechaCreacion}</TableCell>
                <TableCell>{lote.NombreCliente}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver almacenajes">
                    <IconButton color="primary" onClick={() => handleSelectLote(lote)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={showModal && !!selectedLote} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Almacenajes para Lote #{selectedLote?.IdLote}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>Historial de almacenajes</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {almacenajes.length === 0 && <Typography component="li">No hay registros previos.</Typography>}
            {almacenajes.map((a) => (
              <li key={a.IdAlmacenaje}>
                <b>{a.FechaAlmacenaje?.slice(0, 10)}</b> - {a.Ubicacion} ({a.Condicion})
              </li>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary" variant="outlined">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LotesAlmacenadosSection; 