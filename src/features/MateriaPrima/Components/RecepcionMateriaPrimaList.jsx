import React, { useEffect, useState } from 'react';
import { StandardList } from '../../../shared/components';
import { getAllMateriasPrimas } from '../services/materiaPrima.service';

export default function RecepcionMateriaPrimaList({ onRecepcionar, refresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllMateriasPrimas();
      setData(Array.isArray(res) ? res.filter(mp => mp.Estado === 'solicitado') : []);
    } catch (err) {
      setError('Error al cargar solicitudes de materia prima');
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
    { key: 'Cantidad', label: 'Cantidad', align: 'right', type: 'number' },
    { key: 'Unidad', label: 'Unidad', align: 'center' },
    { key: 'Proveedor', label: 'Proveedor', align: 'left' },
    { key: 'FechaRecepcion', label: 'Fecha Solicitud', align: 'center', type: 'date' },
    { key: 'actions', label: 'Acción', align: 'center', type: 'actions' }
  ];

  // Configuración de acciones
  const actions = [
    {
      type: 'view',
      tooltip: 'Recepcionar',
      label: 'Recepcionar'
    }
  ];

  // Manejar acciones
  const handleAction = (actionType, row) => {
    if (actionType === 'view' && onRecepcionar) {
      onRecepcionar(row);
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
      title="Recepción de Materia Prima (Solicitudes Pendientes)"
      emptyMessage="No hay solicitudes pendientes"
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