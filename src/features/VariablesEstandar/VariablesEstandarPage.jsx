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
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useVariablesEstandar from './hooks/useVariablesEstandar';

function VariableFormDialog({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ Nombre: '', Unidad: '', Descripcion: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ Nombre: '', Unidad: '', Descripcion: '' });
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.Nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setError('');
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Editar Variable' : 'Nueva Variable'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Nombre"
          name="Nombre"
          value={form.Nombre}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Unidad"
          name="Unidad"
          value={form.Unidad}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Descripción"
          name="Descripcion"
          value={form.Descripcion}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const handleOpenNew = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (variable) => {
    setEditData(variable);
    setDialogOpen(true);
  };

  const handleSave = async (data) => {
    setActionLoading(true);
    setActionError('');
    try {
      if (editData) {
        await updateVariableEstandar(editData.IdVariableEstandar, data);
      } else {
        await createVariableEstandar(data);
      }
      setDialogOpen(false);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error al guardar');
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

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" fontWeight={700} color="primary" align="center" gutterBottom>
        Variables Estándar
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Administre las variables estándar que luego podrá seleccionar al crear procesos.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenNew}>
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
      {/* Dialogo de alta/edición */}
      <VariableFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        initialData={editData}
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