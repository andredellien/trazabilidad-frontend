import { useState, useCallback } from 'react';
import api from '../../../shared/services/api';

export default function usePedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/pedido');
            setPedidos(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los pedidos');
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePedido = useCallback(async (id, pedido) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.put(`/pedido/${id}`, pedido);
            setPedidos(prev => prev.map(p => p.IdPedido === id ? data : p));
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createMateriaPrima = useCallback(async (materiaPrima) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/materia-prima', materiaPrima);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la materia prima');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createLote = useCallback(async (lote) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/lote', lote);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el lote');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        pedidos,
        loading,
        error,
        fetchPedidos,
        updatePedido,
        createMateriaPrima,
        createLote
    };
} 