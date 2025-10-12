import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { StandardList } from '../../../shared/components';

export default function PedidoList({ pedidos, loading, error }) {
    const navigate = useNavigate();

    // Configuración de columnas para StandardList
    const columns = [
        { key: 'IdPedido', label: 'ID', align: 'center' },
        { key: 'NombreCliente', label: 'Cliente', align: 'left' },
        { key: 'FechaCreacion', label: 'Fecha Creación', align: 'center', type: 'date' },
        { key: 'Estado', label: 'Estado', align: 'center', type: 'status' },
        { key: 'Descripcion', label: 'Descripción', align: 'left' },
        { key: 'actions', label: 'Acciones', align: 'center', type: 'actions' }
    ];

    // Configuración de acciones dinámicas
    const getActions = (pedido) => {
        switch (pedido.Estado) {
            case 'pendiente':
                return [{
                    type: 'custom',
                    label: 'Solicitar Materia Prima',
                    onClick: () => navigate('/solicitar-materia-prima'),
                    variant: 'contained',
                    color: 'primary',
                    size: 'small',
                    sx: { minWidth: 120 }
                }];
            case 'materia prima solicitada':
                return [{
                    type: 'custom',
                    label: 'Crear Lote',
                    onClick: () => navigate('/gestion-lotes'),
                    variant: 'contained',
                    color: 'primary',
                    size: 'small',
                    sx: { minWidth: 120 }
                }];
            case 'en_proceso':
            case 'En Proceso':
                return [{
                    type: 'custom',
                    label: 'Certificar Lote',
                    onClick: () => navigate('/seleccionar-lote'),
                    variant: 'contained',
                    color: 'primary',
                    size: 'small',
                    sx: { minWidth: 120 }
                }];
            default:
                return [];
        }
    };

    // Asegurarse de que pedidos sea siempre un array
    const safePedidos = Array.isArray(pedidos) ? pedidos : [];

    return (
        <StandardList
            data={safePedidos}
            columns={columns}
            loading={loading}
            error={error}
            title=""
            emptyMessage="No hay pedidos registrados"
            showSearch={false}
            getActions={getActions}
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