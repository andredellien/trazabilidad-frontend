import React, { useEffect, useState } from 'react';
import { StandardList } from '../../../shared/components';
import { getAllMateriaPrimaBase } from '../services/materiaPrima.service';

export default function MateriaPrimaBaseList({ refresh, onShowLog }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllMateriaPrimaBase();
      setData(res);
    } catch (err) {
      setError('Error al cargar materias primas base');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refresh]);

  // Configuración de columnas para StandardList
  const columns = [
    { key: 'Nombre', label: 'Nombre', align: 'left' },
    { key: 'Unidad', label: 'Unidad', align: 'center' },
    { key: 'Cantidad', label: 'Cantidad', align: 'right', type: 'number' },
    { key: 'actions', label: 'Registros', align: 'center', type: 'actions' }
  ];

  // Configuración de acciones
  const actions = [
    {
      type: 'view',
      tooltip: 'Ver Registro',
      label: 'Ver Registro'
    }
  ];

  // Manejar acciones
  const handleAction = (actionType, row) => {
    if (actionType === 'view' && onShowLog) {
      onShowLog(row);
    }
  };

  // Asegurarse de que data sea siempre un array
  const safeData = Array.isArray(data) ? data : [];

  return (
    <StandardList
      data={safeData}
      columns={columns}
      actions={actions}
      loading={loading}
      error={error}
      title="Materias Primas Base Registradas"
      emptyMessage="No hay materias primas base registradas"
      onAction={handleAction}
      showSearch={false}
      sx={{ 
        width: '100%', 
        p: 3, 
        boxShadow: 3, 
        borderRadius: 2, 
        bgcolor: 'background.paper' 
      }}
    />
  );
} 