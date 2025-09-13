import useProveedores from "../hooks/useProveedores";
import ProveedorList from "../components/ProveedorList";
import { toast } from "react-toastify";
import { FiTruck } from "react-icons/fi";
import Alert from "../../../shared/components/Alert";
import Card from "../../../shared/components/Card";
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
        </div>
    );
} 