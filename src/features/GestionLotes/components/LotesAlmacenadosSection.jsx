import React, { useEffect, useState } from "react";
import { getLotesAlmacenados } from "../services/lotes.service";
import { getAlmacenajesByLote } from "../services/almacenaje.service";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from "@mui/material";
import { StandardList } from '../../../shared/components';
import { formatDate } from '../../../shared/utils/formatDate';

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
      type: 'view',
      tooltip: 'Ver almacenajes',
      label: 'Ver'
    }
  ];

  // Manejar acciones
  const handleAction = (actionType, row) => {
    if (actionType === 'view') {
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
        title="Lotes Almacenados"
        emptyMessage="No hay lotes almacenados"
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
        <DialogTitle>Almacenajes para Lote #{selectedLote?.IdLote}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>Historial de almacenajes</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {almacenajes.length === 0 && <Typography component="li">No hay registros previos.</Typography>}
            {almacenajes.map((a) => (
              <li key={a.IdAlmacenaje}>
                <b>{formatDate(a.FechaAlmacenaje)}</b> - {a.Ubicacion} ({a.Condicion})
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