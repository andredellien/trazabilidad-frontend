import { useState, useEffect } from "react";
import {
    getAllProveedores,
    createProveedor,
    updateProveedor,
    deleteProveedor
} from "../services/proveedor.service";

export default function useProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            const data = await getAllProveedores();
            setProveedores(data);
            setError(null);
        } catch (err) {
            setError("Error al cargar proveedores");
            console.error("Error en fetchProveedores:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (proveedor) => {
        try {
            await createProveedor(proveedor);
            await fetchProveedores();
            return true;
        } catch (err) {
            setError("Error al crear proveedor");
            console.error("Error en handleCreate:", err);
            return false;
        }
    };

    const handleUpdate = async (id, proveedor) => {
        try {
            await updateProveedor(id, proveedor);
            await fetchProveedores();
            return true;
        } catch (err) {
            setError("Error al actualizar proveedor");
            console.error("Error en handleUpdate:", err);
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProveedor(id);
            await fetchProveedores();
            return true;
        } catch (err) {
            setError("Error al eliminar proveedor");
            console.error("Error en handleDelete:", err);
            return false;
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    return {
        proveedores,
        loading,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshProveedores: fetchProveedores
    };
} 