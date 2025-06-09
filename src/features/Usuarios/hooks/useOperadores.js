import { useState, useEffect } from "react";
import { getAllOperadores, getAllMaquinas, asignarMaquinas as asignarMaquinasService, createUser as createUserService } from "../../../shared/services/operador.service";

export default function useOperadores() {
    const [operadores, setOperadores] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOperadores = async () => {
        try {
            setLoading(true);
            const data = await getAllOperadores();
            // Filtrar solo los operadores (excluir otros roles)
            const operadoresFiltrados = data.filter(op => op.Cargo === "operador");
            setOperadores(operadoresFiltrados);
            setError(null);
        } catch (err) {
            setError("Error al cargar los operadores");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMaquinas = async () => {
        try {
            const data = await getAllMaquinas();
            setMaquinas(data);
        } catch (err) {
            setError("Error al cargar las máquinas");
            console.error(err);
        }
    };

    const createUser = async (userData) => {
        try {
            setLoading(true);
            await createUserService(userData);
            await fetchOperadores(); // Recargar la lista después de crear
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Error al crear el operador");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const asignarMaquinas = async (operadorId, maquinaIds) => {
        try {
            await asignarMaquinasService(operadorId, maquinaIds);
            await fetchOperadores(); // Recargar la lista de operadores
            return true;
        } catch (err) {
            console.error("Error al asignar máquinas:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchOperadores();
        fetchMaquinas();
    }, []);

    return {
        operadores,
        maquinas,
        loading,
        error,
        createUser,
        asignarMaquinas,
        fetchOperadores
    };
} 