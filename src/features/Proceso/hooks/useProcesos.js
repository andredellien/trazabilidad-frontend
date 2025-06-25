import { useState, useCallback } from 'react';
import api from '../../../shared/services/api';

export default function useProcesos() {
    const [procesos, setProcesos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProcesos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/proceso');
            setProcesos(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar los procesos');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        procesos,
        loading,
        error,
        fetchProcesos
    };
} 