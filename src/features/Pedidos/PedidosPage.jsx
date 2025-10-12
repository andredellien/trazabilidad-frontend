import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import useUser from '../Auth/hooks/useUser';
import usePedidos from './hooks/usePedidos';
import PedidoList from './components/PedidoList';
import { ModalForm } from '../../shared/components';
import Modal from '../../shared/components/Modal';

export default function PedidosPage() {
    const { user } = useUser();
    const { createPedido, pedidos, loading, error, fetchPedidos } = usePedidos();
    const [modalOpen, setModalOpen] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });
    const [actionError, setActionError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPedidos();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
        setActionError('');
        setSuccess('');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setActionError('');
        setSuccess('');
    };

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
            
            setSuccess('Pedido creado correctamente');
            setTimeout(() => {
                setSuccess('');
                handleCloseModal();
                fetchPedidos();
            }, 2000);
        } catch (error) {
            console.error("Error al crear pedido:", error);
            setActionError(error.message || "Error al crear el pedido");
        }
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.Descripcion?.trim()) {
            errors.Descripcion = 'La descripción es obligatoria';
        }
        if (!formData.FechaEntrega) {
            errors.FechaEntrega = 'La fecha de entrega es obligatoria';
        }
        if (!formData.Cantidad || formData.Cantidad <= 0) {
            errors.Cantidad = 'La cantidad debe ser mayor a 0';
        }
        if (!formData.Unidad) {
            errors.Unidad = 'La unidad es obligatoria';
        }
        return errors;
    };

    const fields = [
        {
            name: 'Descripcion',
            label: 'Descripción del Pedido',
            type: 'textarea',
            required: true,
            rows: 3,
            autoFocus: true
        },
        {
            name: 'FechaEntrega',
            label: 'Fecha de Entrega',
            type: 'date',
            required: true,
            InputLabelProps: {
                shrink: true
            },
            inputProps: {
                min: new Date().toISOString().split('T')[0]
            }
        },
        {
            name: 'Cantidad',
            label: 'Cantidad',
            type: 'number',
            required: true,
            min: 1,
            step: 1
        },
        {
            name: 'Unidad',
            label: 'Unidad',
            type: 'select',
            required: true,
            options: [
                { value: 'kg', label: 'Kilogramos (kg)' },
                { value: 'lts', label: 'Litros (lts)' }
            ]
        }
    ];

    // Filtrar pedidos del usuario logueado
    const pedidosUsuario = pedidos.filter(
        (pedido) => pedido.IdCliente === user?.IdOperador
    );

    return (
        <Container maxWidth={false} sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={600}>
                    Mis Pedidos
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    Gestiona tus pedidos y solicitudes
                </Typography>
            </Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    size="small"
                >
                    Crear Nuevo Pedido
                </Button>
            </Box>
            {/* Lista de pedidos */}
            <PedidoList 
                pedidos={pedidosUsuario}
                loading={loading}
                error={error}
            />

            <ModalForm
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title="Crear Nuevo Pedido"
                fields={fields}
                onSubmit={handleSubmit}
                loading={loading}
                error={actionError}
                success={success}
                initialValues={{ 
                    Descripcion: '', 
                    FechaEntrega: '', 
                    Cantidad: 1, 
                    Unidad: 'kg' 
                }}
                validate={validateForm}
                submitButtonText="Crear Pedido"
                maxWidth="sm"
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