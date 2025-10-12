import React, { useEffect, useState } from "react";
import { getLotesCertificados } from "../services/lotes.service";
import { getAlmacenajesByLote, createAlmacenaje } from "../services/almacenaje.service";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { StandardList } from '../../../shared/components';
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

  // Configuración de columnas para StandardList
  const columns = [
    { key: 'IdLote', label: 'ID', align: 'center' },
    { key: 'Nombre', label: 'Nombre', align: 'left' },
    { key: 'FechaCreacion', label: 'Fecha', align: 'center', type: 'date' },
    { key: 'NombreCliente', label: 'Cliente', align: 'left' },
    { key: 'actions', label: 'Acción', align: 'center', type: 'actions' }
  ];

  // Configuración de acciones
  const actions = [
    {
      type: 'warehouse',
      tooltip: 'Almacenar',
      label: 'Almacenar'
    }
  ];

  // Manejar acciones
  const handleAction = (actionType, row) => {
    if (actionType === 'warehouse') {
      handleSelectLote(row);
    }
  };

  return (
    <Box>
      <StandardList
        data={lotes}
        columns={columns}
        actions={actions}
        loading={loading}
        error={error}
        title="Almacenaje de Lotes Certificados"
        emptyMessage="No hay lotes certificados disponibles"
        onAction={handleAction}
        showSearch={false}
        sx={{ 
          width: '100%', 
          p: 3, 
          boxShadow: 3, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          mb: 2
        }}
      />

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