import React, { useState } from "react";
import useProveedores from "../hooks/useProveedores";
import ProveedorList from "../components/ProveedorList";
import { toast } from "react-toastify";
import { FiTruck } from "react-icons/fi";
import Alert from "../../../shared/components/Alert";
import Card from "../../../shared/components/Card";
import DeleteConfirmDialog from "../../../shared/components/DeleteConfirmDialog";
import BackButton from "../../../shared/components/BackButton";
import "../styles/Proveedores.css";

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
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-primary text-lg">Cargando proveedores...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert type="error" title="Error">
                    {error}
                </Alert>
            </div>
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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
                    <FiTruck className="text-4xl" />
                    Gestión de Proveedores
                </h1>
                <p className="text-lg text-secondary">
                    Administre la información de sus proveedores
                </p>
            </div>
            
            <Card>
                <ProveedorList
                    proveedores={proveedores}
                    onUpdate={handleUpdateProveedor}
                    onDelete={handleDeleteProveedor}
                    onCreate={handleCreateProveedor}
                />
            </Card>
            <DeleteConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="¿Eliminar proveedor?"
                message="Esta acción eliminará el proveedor de forma permanente."
                confirmLabel="Eliminar"
            />
        </div>
    );
} 