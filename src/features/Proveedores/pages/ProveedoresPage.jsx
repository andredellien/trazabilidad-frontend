import React, { useState } from "react";
import useProveedores from "../hooks/useProveedores";
import ProveedorList from "../components/ProveedorList";
import { toast } from "react-toastify";
import { Container, Box, Typography } from "@mui/material";
import Alert from "../../../shared/components/Alert";
import DeleteConfirmDialog from "../../../shared/components/DeleteConfirmDialog";

export default function ProveedoresPage() {
    const {
        proveedores,
        loading,
        error,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useProveedores();

    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <Typography>Cargando proveedores...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert type="error" title="Error">
                    {error}
                </Alert>
            </Container>
        );
    }

    const handleCreateProveedor = async (formData) => {
        try {
            await handleCreate(formData);
            toast.success("Proveedor creado exitosamente");
        } catch (error) {
            toast.error("Error al crear el proveedor");
        }
    };

    const handleUpdateProveedor = async (id, formData) => {
        try {
            await handleUpdate(id, formData);
            toast.success("Proveedor actualizado exitosamente");
        } catch (error) {
            toast.error("Error al actualizar el proveedor");
        }
    };

    const handleDeleteProveedor = async (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await handleDelete(deleteId);
            toast.success("Proveedor eliminado exitosamente");
            setDeleteId(null);
        } catch (error) {
            toast.error("Error al eliminar el proveedor");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Gestión de Proveedores
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Administre la información de sus proveedores
                </Typography>
            </Box>
            
            <ProveedorList
                proveedores={proveedores}
                onUpdate={handleUpdateProveedor}
                onDelete={handleDeleteProveedor}
                onCreate={handleCreateProveedor}
            />
            
            <DeleteConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="¿Eliminar proveedor?"
                message="Esta acción eliminará el proveedor de forma permanente."
                confirmLabel="Eliminar"
            />
        </Container>
    );
} 