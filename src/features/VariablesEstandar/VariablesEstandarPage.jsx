import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ModalForm } from '../../shared/components';
import useVariablesEstandar from './hooks/useVariablesEstandar';

export default function VariablesEstandarPage() {
  const {
    variables,
    loading,
    error,
    fetchVariables,
    createVariableEstandar,
    updateVariableEstandar,
    deleteVariableEstandar
  } = useVariablesEstandar();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const handleOpenNew = () => {
    setEditData(null);
    setModalOpen(true);
    setActionError('');
    setSuccess('');
  };

  const handleOpenEdit = (variable) => {
    setEditData(variable);
    setModalOpen(true);
    setActionError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setActionError('');
    setSuccess('');
  };

  const handleSubmit = async (formData) => {
    setActionLoading(true);
    setActionError('');
    setSuccess('');
    
    try {
      if (editData) {
        await updateVariableEstandar(editData.IdVariableEstandar, formData);
        setSuccess('Variable estándar actualizada exitosamente');
      } else {
        await createVariableEstandar(formData);
        setSuccess('Variable estándar creada exitosamente');
      }
      
      setTimeout(() => {
        setSuccess('');
        handleCloseModal();
        fetchVariables(); // Refrescar la lista
      }, 2000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al guardar la variable estándar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    setActionError('');
    try {
      await deleteVariableEstandar(id);
      setDeleteId(null);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setActionLoading(false);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.Nombre?.trim()) {
      errors.Nombre = 'El nombre es obligatorio';
    }
    return errors;
  };

  const fields = [
    {
      name: 'Nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      autoFocus: true
    },
    {
      name: 'Unidad',
      label: 'Unidad',
      type: 'text'
    },
    {
      name: 'Descripcion',
      label: 'Descripción',
      type: 'textarea',
      rows: 3
    }
  ];

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary" align="center" gutterBottom>
        Variables Estándar
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Administre las variables estándar que luego podrá seleccionar al crear procesos.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew} size="small">
          Nueva Variable
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : variables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay variables registradas.
                </TableCell>
              </TableRow>
            ) : (
              variables.map(variable => (
                <TableRow key={variable.IdVariableEstandar}>
                  <TableCell>{variable.Nombre}</TableCell>
                  <TableCell>{variable.Unidad}</TableCell>
                  <TableCell>{variable.Descripcion}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenEdit(variable)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => setDeleteId(variable.IdVariableEstandar)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      {/* ModalForm para crear/editar variables */}
      <ModalForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editData ? 'Editar Variable Estándar' : 'Nueva Variable Estándar'}
        fields={fields}
        onSubmit={handleSubmit}
        loading={actionLoading}
        error={actionError}
        success={success}
        initialValues={editData || { Nombre: '', Unidad: '', Descripcion: '' }}
        validate={validateForm}
        submitButtonText={editData ? 'Actualizar' : 'Crear'}
        maxWidth="sm"
      />
      {/* Dialogo de confirmación de borrado */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Eliminar variable estándar?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción desactivará la variable estándar y no podrá ser seleccionada en nuevos procesos.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button onClick={() => handleDelete(deleteId)} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 