import React from 'react';

export default function PedidoList({ pedidos, loading, error }) {
    if (loading) {
        return <div className="loading-container">Cargando pedidos...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!pedidos || pedidos.length === 0) {
        return <div className="mp-message">No hay pedidos registrados</div>;
    }

    const getEstadoBadge = (estado) => {
        const estados = {
            pendiente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
            en_proceso: { color: 'bg-blue-100 text-blue-800', label: 'En Proceso' },
            completado: { color: 'bg-green-100 text-green-800', label: 'Completado' },
            cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
        };

        const estadoInfo = estados[estado] || { color: 'bg-gray-100 text-gray-800', label: estado };
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                {estadoInfo.label}
            </span>
        );
    };

    return (
        <div className="mp-table-wrapper">
            <table className="mp-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha Creación</th>
                        <th>Estado</th>
                        <th>Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.IdPedido}>
                            <td>{pedido.IdPedido}</td>
                            <td>{pedido.IdCliente}</td>
                            <td>{new Date(pedido.FechaCreacion).toLocaleDateString()}</td>
                            <td>{getEstadoBadge(pedido.Estado)}</td>
                            <td>{pedido.Descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 