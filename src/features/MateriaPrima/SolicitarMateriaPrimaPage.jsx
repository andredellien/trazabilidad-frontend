import React, { useState, useEffect } from 'react';
import SolicitudesMateriaPrimaList from './Components/SolicitudesMateriaPrimaList';
import { Box, Container, Button, Typography, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ModalForm } from '../../shared/components';
import { getAllMateriaPrimaBase, createMateriaPrima } from './services/materiaPrima.service';
import { getAllProveedores } from '../Proveedores/services/proveedor.service';
import usePedidosPendientes from './hooks/usePedidosPendientes';

export default function SolicitarMateriaPrimaPage() {
  const [refresh, setRefresh] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos para los selects
  const [bases, setBases] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  
  // Hook para pedidos pendientes
  const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidosPendientes();

  const handleCreated = () => setRefresh(r => r + 1);

  const handleOpenModal = () => {
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError('');
    setSuccess('');
  };

  // Cargar datos iniciales
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

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const proveedorObj = proveedores.find(p => p.IdProveedor === Number(formData.proveedorId));
      await createMateriaPrima({
        Nombre: bases.find(b => b.IdMateriaPrimaBase === Number(formData.baseId))?.Nombre || '',
        Cantidad: formData.cantidad,
        Unidad: formData.unidad,
        Estado: 'solicitado',
        IdMateriaPrimaBase: Number(formData.baseId),
        IdProveedor: Number(formData.proveedorId),
        IdPedido: Number(formData.pedidoId),
        Proveedor: proveedorObj ? proveedorObj.Nombre : ''
      });
      setSuccess('Solicitud creada exitosamente');
      setTimeout(() => {
        setSuccess('');
        handleCloseModal();
        handleCreated();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.baseId) {
      errors.baseId = 'Debes seleccionar una materia prima base';
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      errors.cantidad = 'La cantidad debe ser mayor a 0';
    }
    if (!formData.proveedorId) {
      errors.proveedorId = 'Debes seleccionar un proveedor';
    }
    if (!formData.pedidoId) {
      errors.pedidoId = 'Debes seleccionar un pedido';
    }
    return errors;
  };

  const handleFieldChange = (fieldName, value, formData) => {
    // Si cambia la materia prima base, actualizar la unidad automáticamente
    if (fieldName === 'baseId') {
      const base = bases.find(b => b.IdMateriaPrimaBase === Number(value));
      if (base) {
        // Devolver los datos actualizados con la unidad autocompletada
        return {
          ...formData,
          [fieldName]: value,
          unidad: base.Unidad
        };
      }
    }
    
    // Para otros campos, devolver los datos sin cambios
    return formData;
  };

  const fields = [
    {
      name: 'baseId',
      label: 'Materia Prima Base',
      type: 'select',
      required: true,
      options: bases.map(base => ({
        value: base.IdMateriaPrimaBase,
        label: `${base.Nombre} (${base.Unidad})`
      }))
    },
    {
      name: 'unidad',
      label: 'Unidad',
      type: 'text',
      required: true,
      InputProps: { readOnly: true },
      helperText: 'Se autocompleta según la materia prima base seleccionada'
    },
    {
      name: 'cantidad',
      label: 'Cantidad',
      type: 'number',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      name: 'proveedorId',
      label: 'Proveedor',
      type: 'select',
      required: true,
      options: proveedores.map(prov => ({
        value: prov.IdProveedor,
        label: prov.Nombre
      }))
    },
    {
      name: 'pedidoId',
      label: 'Pedido',
      type: 'select',
      required: true,
      disabled: loadingPedidos,
      helperText: loadingPedidos ? "Cargando pedidos..." : errorPedidos ? errorPedidos : "",
      error: !!errorPedidos,
      options: [
        { value: '', label: 'Seleccionar pedido disponible' },
        ...pedidos.map(pedido => ({
          value: pedido.IdPedido,
          label: `Pedido #${pedido.IdPedido} - ${pedido.Descripcion || "Sin descripción"} (${pedido.Estado})`
        }))
      ]
    }
  ];

  if (loadingData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          Solicitudes de Materia Prima
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          size= 'small'
        >
          Solicitar Materia Prima
        </Button>
      </Box>
      
      <SolicitudesMateriaPrimaList refresh={refresh} />
      
      <ModalForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Solicitar Materia Prima"
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
        initialValues={{ 
          baseId: '', 
          unidad: '', 
          cantidad: 0, 
          proveedorId: '', 
          pedidoId: '' 
        }}
        validate={validateForm}
        onFieldChange={handleFieldChange}
        submitButtonText="Solicitar"
        maxWidth="sm"
      />
    </Container>
  );
} 