import { useState, useCallback } from 'react';
import {
  getAllVariablesEstandar,
  createVariableEstandar,
  updateVariableEstandar,
  deleteVariableEstandar
} from '../services/variableEstandar.service';

export default function useVariablesEstandar() {
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVariables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVariablesEstandar();
      setVariables(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar variables estándar');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await createVariableEstandar(data);
      await fetchVariables();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear variable estándar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateVariableEstandar(id, data);
      await fetchVariables();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar variable estándar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVariableEstandar(id);
      await fetchVariables();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar variable estándar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    variables,
    loading,
    error,
    fetchVariables,
    createVariableEstandar: handleCreate,
    updateVariableEstandar: handleUpdate,
    deleteVariableEstandar: handleDelete
  };
} 