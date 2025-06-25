import React, { useState, useEffect } from 'react';
import useUser from '../Auth/hooks/useUser';
import usePedidos from './hooks/usePedidos';
import PedidoList from './components/PedidoList';
import Modal from '../../shared/components/Modal';

export default function GestionPedidosPage() {
    const { user } = useUser();
    const { pedidos, loading, error, fetchPedidos } = usePedidos();
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });

    useEffect(() => {
        if (user?.Cargo === 'admin') {
            fetchPedidos();
        }
    }, [user]);

    if (user?.Cargo !== 'admin') {
        return (
            <div className="container mx-auto px-4">
                <div className="error-container">
                    No tienes permisos para acceder a esta sección
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="space-y-8">
                <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
                
                <PedidoList 
                    pedidos={pedidos}
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