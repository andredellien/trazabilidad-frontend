import React, { useRef, useState } from 'react';
import { Modal, Box, Typography, Button, Switch, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { updateMateriaPrima } from '../services/materiaPrima.service';

export default function RecepcionMateriaPrimaModal({ open, onClose, materiaPrima, onSaved }) {
  const [conforme, setConforme] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const sigCanvas = useRef();

  if (!materiaPrima) return null;

  const handleClear = () => {
    sigCanvas.current.clear();
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    console.log('Intentando guardar recepción...');
    if (sigCanvas.current.isEmpty()) {
      setError('La firma es obligatoria');
      console.log('Firma vacía');
      return;
    }
    setLoading(true);
    try {
      const firmaBase64 = sigCanvas.current.getCanvas().toDataURL('image/png');
      const datosAEnviar = {
        Nombre: materiaPrima.Nombre || '',
        Cantidad: materiaPrima.Cantidad || 0,
        Unidad: materiaPrima.Unidad || '',
        Estado: conforme ? 'recibida' : 'rechazada',
        RecepcionConforme: conforme,
        FirmaRecepcion: firmaBase64,
        IdMateriaPrimaBase: materiaPrima.IdMateriaPrimaBase || null,
        Proveedor: materiaPrima.Proveedor || '',
        IdProveedor: materiaPrima.IdProveedor || null,
        FechaRecepcion: new Date().toISOString().split('T')[0]
      };
      console.log('Datos a enviar:', datosAEnviar);
      await updateMateriaPrima(materiaPrima.IdMateriaPrima, datosAEnviar);
      setSuccess('Recepción guardada exitosamente');
      if (onSaved) onSaved();
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la recepción');
      console.log('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 6 }}>
        <Typography variant="h6" mb={2} align="center">Recepción de Materia Prima</Typography>
        <Typography mb={1}><b>Nombre:</b> {materiaPrima.Nombre}</Typography>
        <Typography mb={1}><b>Cantidad:</b> {materiaPrima.Cantidad} {materiaPrima.Unidad}</Typography>
        <Typography mb={2}><b>Proveedor:</b> {materiaPrima.Proveedor}</Typography>
        <FormControlLabel
          control={<Switch checked={conforme} onChange={e => setConforme(e.target.checked)} color="primary" />}
          label="Recepción conforme"
        />
        <Typography mt={2} mb={1}>Firma de recepción:</Typography>
        <Box border={1} borderColor="grey.400" borderRadius={1} mb={1}>
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{ width: 340, height: 120, className: 'sigCanvas' }}
            backgroundColor="#fff"
          />
        </Box>
        <Button onClick={handleClear} size="small" sx={{ mb: 2 }}>Limpiar firma</Button>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box mt={2} display="flex" justifyContent="center">
          <Button onClick={handleSave} variant="contained" color="primary" disabled={loading} sx={{ minWidth: 120 }}>
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 