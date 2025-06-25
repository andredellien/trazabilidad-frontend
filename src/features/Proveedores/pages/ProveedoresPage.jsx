import useProveedores from "../hooks/useProveedores";
import ProveedorList from "../components/ProveedorList";
import { toast } from "react-toastify";
import { FiTruck } from "react-icons/fi";
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Cargando proveedores...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
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
        if (window.confirm("¿Está seguro de eliminar este proveedor?")) {
            try {
                await handleDelete(id);
                toast.success("Proveedor eliminado exitosamente");
            } catch (error) {
                toast.error("Error al eliminar el proveedor");
            }
        }
    };

    return (
        <div className="proveedores-page">
            <div className="proveedores-header">
                <h1>
                    <FiTruck className="header-icon" />
                    Gestión de Proveedores
                </h1>
            </div>
            <ProveedorList
                proveedores={proveedores}
                onUpdate={handleUpdateProveedor}
                onDelete={handleDeleteProveedor}
                onCreate={handleCreateProveedor}
            />
        </div>
    );
} 