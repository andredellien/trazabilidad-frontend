import { useState } from 'react';
import { createPedido, getAllPedidos } from '../services/pedido.service';

export default function usePedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPedidos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllPedidos();
            setPedidos(data);
        } catch (err) {
            setError(err.message || 'Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (pedido) => {
        try {
            setLoading(true);
            setError(null);
            await createPedido(pedido);
            await fetchPedidos();
        } catch (err) {
            setError(err.message || 'Error al crear el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        pedidos,
        loading,
        error,
        fetchPedidos,
        createPedido: handleCreate
    };
} 