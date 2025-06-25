import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Alert, CircularProgress } from '@mui/material';
import { createMateriaPrimaBase } from '../services/materiaPrima.service';

const unidades = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lts', label: 'Litros (lts)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unid', label: 'Unidades' },
];

export default function MateriaPrimaBaseForm({ onCreated }) {
  const [nombre, setNombre] = useState('');
  const [unidad, setUnidad] = useState('kg');
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!nombre.trim()) return 'El nombre es obligatorio';
    if (!unidad) return 'La unidad es obligatoria';
    if (cantidad < 0) return 'La cantidad no puede ser negativa';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await createMateriaPrimaBase({
        Nombre: nombre,
        Unidad: unidad,
        Cantidad: cantidad
      });
      setSuccess('Materia prima base creada exitosamente');
      setNombre('');
      setUnidad('kg');
      setCantidad(0);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear materia prima base');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} fontWeight={600} align="center">
        Crear Materia Prima Base
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        label="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        fullWidth
        required
        margin="normal"
        autoFocus
      />
      <TextField
        select
        label="Unidad"
        value={unidad}
        onChange={e => setUnidad(e.target.value)}
        fullWidth
        required
        margin="normal"
      >
        {unidades.map(option => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Cantidad inicial"
        type="number"
        value={cantidad}
        onChange={e => setCantidad(Number(e.target.value))}
        fullWidth
        margin="normal"
        inputProps={{ min: 0, step: 0.01 }}
      />
      <Box mt={2} display="flex" justifyContent="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading} size="large" sx={{ minWidth: 120 }}>
          {loading ? <CircularProgress size={24} /> : 'Crear'}
        </Button>
      </Box>
    </Box>
  );
} 