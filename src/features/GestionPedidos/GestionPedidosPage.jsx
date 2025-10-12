import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
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
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="error">
                        No tienes permisos para acceder a esta sección
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Gestión de Pedidos
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Administra y gestiona todos los pedidos del sistema
                </Typography>
            </Box>
            
            <PedidoList 
                pedidos={pedidos}
                loading={loading}
                error={error}
            />

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                showConfirmButton={modal.showConfirmButton}
            />
        </Container>
    );
} 