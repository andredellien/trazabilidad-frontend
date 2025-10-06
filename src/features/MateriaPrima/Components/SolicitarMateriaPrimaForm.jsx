import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Alert, CircularProgress } from '@mui/material';
import { getAllMateriaPrimaBase, createMateriaPrima } from '../services/materiaPrima.service';
import { getAllProveedores } from '../../Proveedores/services/proveedor.service';
import usePedidosPendientes from '../hooks/usePedidosPendientes';
import NumberStepper from '../../../shared/components/NumberStepper';

export default function SolicitarMateriaPrimaForm({ onCreated }) {
  const [bases, setBases] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [baseId, setBaseId] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [proveedorId, setProveedorId] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidosPendientes();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [basesRes, proveedoresRes] = await Promise.all([
          getAllMateriaPrimaBase(),
          getAllProveedores()
        ]);
        setBases(Array.isArray(basesRes) ? basesRes : []);
        setProveedores(Array.isArray(proveedoresRes) ? proveedoresRes : []);
      } catch (err) {
        setError('Error al cargar datos iniciales');
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Autocompletar unidad según la base seleccionada
    const base = bases.find(b => b.IdMateriaPrimaBase === Number(baseId));
    setUnidad(base ? base.Unidad : '');
  }, [baseId, bases]);

  const validate = () => {
    if (!baseId) return 'Debes seleccionar una materia prima base';
    if (!cantidad || cantidad <= 0) return 'La cantidad debe ser mayor a 0';
    if (!proveedorId) return 'Debes seleccionar un proveedor';
    if (!pedidoId) return 'Debes seleccionar un pedido';
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
      const proveedorObj = proveedores.find(p => p.IdProveedor === Number(proveedorId));
      await createMateriaPrima({
        Nombre: bases.find(b => b.IdMateriaPrimaBase === Number(baseId))?.Nombre || '',
        Cantidad: cantidad,
        Unidad: unidad,
        Estado: 'solicitado',
        IdMateriaPrimaBase: Number(baseId),
        IdProveedor: Number(proveedorId),
        IdPedido: Number(pedidoId),
        Proveedor: proveedorObj ? proveedorObj.Nombre : ''
      });
      setSuccess('Solicitud creada exitosamente');
      setBaseId('');
      setUnidad('');
      setCantidad(0);
      setProveedorId('');
      setPedidoId('');
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5" mb={2} fontWeight={600} align="center">
        Solicitar Materia Prima
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        select
        label="Materia Prima Base"
        value={baseId}
        onChange={e => setBaseId(e.target.value)}
        fullWidth
        required
        margin="normal"
      >
        {bases.map(base => (
          <MenuItem key={base.IdMateriaPrimaBase} value={base.IdMateriaPrimaBase}>
            {base.Nombre} ({base.Unidad})
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Unidad"
        value={unidad}
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <NumberStepper
        label="Cantidad"
        value={cantidad}
        onChange={setCantidad}
        min={0}
        step={0.01}
        unit={unidad}
        margin="normal"
      />
      <TextField
        select
        label="Proveedor"
        value={proveedorId}
        onChange={e => setProveedorId(e.target.value)}
        fullWidth
        required
        margin="normal"
      >
        {proveedores.map(prov => (
          <MenuItem key={prov.IdProveedor} value={prov.IdProveedor}>
            {prov.Nombre}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Pedido"
        value={pedidoId}
        onChange={e => setPedidoId(e.target.value)}
        fullWidth
        required
        margin="normal"
        disabled={loadingPedidos}
        helperText={loadingPedidos ? "Cargando pedidos..." : errorPedidos ? errorPedidos : ""}
        error={!!errorPedidos}
      >
        <MenuItem value="">
          <em>Seleccionar pedido disponible</em>
        </MenuItem>
        {pedidos.map((pedido) => (
          <MenuItem key={pedido.IdPedido} value={pedido.IdPedido}>
            Pedido #{pedido.IdPedido} - {pedido.Descripcion || "Sin descripción"} ({pedido.Estado})
          </MenuItem>
        ))}
      </TextField>
      <Box mt={2} display="flex" justifyContent="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading} size="small" sx={{ minWidth: 120 }}>
          {loading ? <CircularProgress size={24} /> : 'Solicitar'}
        </Button>
      </Box>
    </Box>
  );
} 