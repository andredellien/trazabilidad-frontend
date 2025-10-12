import { useState } from "react";
import { Button, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StandardList, ModalForm } from "../../../shared/components";

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

    // Configuración de columnas para StandardList
    const columns = [
        { key: 'IdProveedor', label: 'ID', align: 'center' },
        { key: 'Nombre', label: 'Nombre', align: 'left' },
        { key: 'Contacto', label: 'Contacto', align: 'left' },
        { key: 'Telefono', label: 'Teléfono', align: 'left' },
        { key: 'Email', label: 'Email', align: 'left' },
        { key: 'Direccion', label: 'Dirección', align: 'left' },
        { key: 'actions', label: 'Acciones', align: 'center', type: 'actions' }
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'edit',
            tooltip: 'Editar proveedor',
            label: 'Editar'
        },
        {
            type: 'delete',
            tooltip: 'Eliminar proveedor',
            label: 'Eliminar'
        }
    ];

    // Manejar acciones
    const handleAction = (actionType, row) => {
        if (actionType === 'edit') {
            handleEdit(row);
        } else if (actionType === 'delete') {
            onDelete(row.IdProveedor);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate} size="small">
                    Nuevo Proveedor
                </Button>
            </Box>
            
            <StandardList
                data={proveedores}
                columns={columns}
                actions={actions}
                title=""
                emptyMessage="No hay proveedores registrados"
                onAction={handleAction}
                showSearch={false}
                sx={{ 
                    width: '100%', 
                    p: 3, 
                    boxShadow: 3, 
                    borderRadius: 2, 
                    bgcolor: 'background.paper' 
                }}
            />

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