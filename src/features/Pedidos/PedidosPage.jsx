import React, { useState, useEffect } from 'react';
import useUser from '../Auth/hooks/useUser';
import usePedidos from './hooks/usePedidos';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import Modal from '../../shared/components/Modal';
import Card from '../../shared/components/Card';

export default function PedidosPage() {
    const { user } = useUser();
    const { createPedido, pedidos, loading, error, fetchPedidos } = usePedidos();
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });

    useEffect(() => {
        fetchPedidos();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (!user) {
                throw new Error("Usuario no autenticado");
            }
            await createPedido({
                ...formData,
                IdCliente: user.IdOperador,
                Estado: "pendiente"
            });
            await fetchPedidos();
            setModal({
                isOpen: true,
                title: "Éxito",
                message: "Pedido creado correctamente",
                type: "success"
            });
        } catch (error) {
            console.error("Error al crear pedido:", error);
            setModal({
                isOpen: true,
                title: "Error",
                message: error.message || "Error al crear el pedido",
                type: "error"
            });
        }
    };

    // Filtrar pedidos del usuario logueado
    const pedidosUsuario = pedidos.filter(
        (pedido) => pedido.IdCliente === user?.IdOperador
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-4">
                    🛒 Mis Pedidos
                </h1>
                <p className="text-lg text-secondary">
                    Gestiona tus pedidos y solicitudes
                </p>
            </div>

            <div className="space-y-8">
                {/* Formulario de creación */}
                <Card title="Crear Nuevo Pedido">
                    <PedidoForm onSubmit={handleSubmit} loading={loading} />
                </Card>

                {/* Lista de pedidos */}
                <PedidoList 
                    pedidos={pedidosUsuario}
                    loading={loading}
                    error={error}
                />
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                showConfirmButton={modal.showConfirmButton}
            />
        </div>
    );
} 