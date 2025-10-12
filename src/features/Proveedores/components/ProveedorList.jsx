import { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Tooltip, Button, Box, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { ModalForm } from "../../../shared/components";

export default function ProveedorList({ proveedores, onUpdate, onDelete, onCreate }) {
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEdit = (proveedor) => {
        setSelectedProveedor(proveedor);
        setIsEditing(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleCreate = () => {
        setSelectedProveedor(null);
        setIsEditing(false);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedProveedor(null);
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            if (isEditing) {
                await onUpdate(selectedProveedor.IdProveedor, formData);
                setSuccess('Proveedor actualizado exitosamente');
            } else {
                await onCreate(formData);
                setSuccess('Proveedor creado exitosamente');
            }
            
            setTimeout(() => {
                setSuccess('');
                handleCloseForm();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.Nombre?.trim()) {
            errors.Nombre = 'El nombre del proveedor es obligatorio';
        }
        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            errors.Email = 'El email no tiene un formato válido';
        }
        return errors;
    };

    const fields = [
        {
            name: 'Nombre',
            label: 'Nombre del Proveedor',
            type: 'text',
            required: true,
            placeholder: 'Ej: Proveedor ABC S.A.'
        },
        {
            name: 'Contacto',
            label: 'Persona de Contacto',
            type: 'text',
            required: false,
            placeholder: 'Ej: Juan Pérez'
        },
        {
            name: 'Telefono',
            label: 'Teléfono',
            type: 'tel',
            required: false,
            placeholder: 'Ej: +1 234 567 8900'
        },
        {
            name: 'Email',
            label: 'Email',
            type: 'email',
            required: false,
            placeholder: 'Ej: contacto@proveedor.com'
        },
        {
            name: 'Direccion',
            label: 'Dirección',
            type: 'textarea',
            required: false,
            rows: 3,
            placeholder: 'Ej: Calle Principal 123, Ciudad, País'
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
                    Nuevo Proveedor
                </Button>
            </Box>
            <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Contacto</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proveedores.map((proveedor) => (
                            <TableRow key={proveedor.IdProveedor} hover>
                                <TableCell>{proveedor.IdProveedor}</TableCell>
                                <TableCell>{proveedor.Nombre}</TableCell>
                                <TableCell>{proveedor.Contacto || "-"}</TableCell>
                                <TableCell>{proveedor.Telefono || "-"}</TableCell>
                                <TableCell>{proveedor.Email || "-"}</TableCell>
                                <TableCell>{proveedor.Direccion || "-"}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar">
                                        <IconButton color="primary" onClick={() => handleEdit(proveedor)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => onDelete(proveedor.IdProveedor)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <ModalForm
                isOpen={showForm}
                onClose={handleCloseForm}
                title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
                fields={fields}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
                initialValues={{
                    Nombre: selectedProveedor?.Nombre || '',
                    Contacto: selectedProveedor?.Contacto || '',
                    Telefono: selectedProveedor?.Telefono || '',
                    Email: selectedProveedor?.Email || '',
                    Direccion: selectedProveedor?.Direccion || ''
                }}
                validate={validateForm}
                submitButtonText={isEditing ? "Actualizar Proveedor" : "Crear Proveedor"}
                maxWidth="sm"
            />
        </Box>
    );
} 