import React from 'react';
import { StandardList } from '../../../shared/components';

export default function PedidoList({ pedidos, loading, error }) {
    // Configuración de columnas para StandardList
    const columns = [
        { key: 'IdPedido', label: 'ID', align: 'center' },
        { key: 'NombreCliente', label: 'Cliente', align: 'left' },
        { key: 'FechaCreacion', label: 'Fecha Creación', align: 'center', type: 'date' },
        { key: 'Descripcion', label: 'Descripción', align: 'left' },
        { key: 'Estado', label: 'Estado', align: 'center', type: 'status' }
    ];

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