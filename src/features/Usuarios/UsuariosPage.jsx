import React, { useState } from "react";
import { Box, Container, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import useOperadores from "./hooks/useOperadores";
import useAuth from "../Auth/hooks/useAuth";
import OperadoresList from "./components/OperadoresList";
import { ModalForm } from "../../shared/components";
import Modal from "../../shared/components/Modal";

export default function UsuariosPage() {
	const { user } = useAuth();
	const { createUser, error, loading, fetchOperadores, operadores, maquinas, asignarMaquinas } = useOperadores();
	const [modalOpen, setModalOpen] = useState(false);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });
	const [actionError, setActionError] = useState('');
	const [success, setSuccess] = useState('');

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
			await createUser(formData);
			setSuccess('Usuario creado correctamente');
			setTimeout(() => {
				setSuccess('');
				handleCloseModal();
				fetchOperadores();
			}, 2000);
		} catch (error) {
			console.error("Error al crear usuario:", error);
			setActionError(error.message || "Error al crear el usuario");
		}
	};

	const validateForm = (formData) => {
		const errors = {};
		if (!formData.Nombre?.trim()) {
			errors.Nombre = 'El nombre es obligatorio';
		}
		if (!formData.Cargo) {
			errors.Cargo = 'El cargo es obligatorio';
		}
		if (!formData.Usuario?.trim()) {
			errors.Usuario = 'El usuario es obligatorio';
		}
		if (!formData.Password) {
			errors.Password = 'La contraseña es obligatoria';
		}
		if (!formData.confirmPassword) {
			errors.confirmPassword = 'Confirmar contraseña es obligatorio';
		}
		if (formData.Password && formData.confirmPassword && formData.Password !== formData.confirmPassword) {
			errors.confirmPassword = 'Las contraseñas no coinciden';
		}
		return errors;
	};

	const fields = [
		{
			name: 'Nombre',
			label: 'Nombre completo',
			type: 'text',
			required: true,
			autoFocus: true
		},
		{
			name: 'Cargo',
			label: 'Cargo',
			type: 'select',
			required: true,
			options: [
				{ value: "admin", label: "Administrador" },
				{ value: "operador", label: "Operador" },
				{ value: "cliente", label: "Cliente" }
			]
		},
		{
			name: 'Usuario',
			label: 'Usuario',
			type: 'text',
			required: true
		},
		{
			name: 'Password',
			label: 'Contraseña',
			type: 'password',
			required: true
		},
		{
			name: 'confirmPassword',
			label: 'Confirmar Contraseña',
			type: 'password',
			required: true
		}
	];

	return (
		<Container maxWidth={false} sx={{ py: 4 }}>
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h4" fontWeight={600}>
					Gestión de Usuarios
				</Typography>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Typography variant="body1" color="text.secondary">
					Administre usuarios y operadores del sistema
				</Typography>
			</Box>
			<Box sx={{ mb: 3, display: 'flex',justifyContent: 'flex-end', alignItems: 'center' }}>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleOpenModal}
					size="small"
				>
					Crear Nuevo Usuario
				</Button>
			</Box>
			{/* Lista de operadores */}
			<OperadoresList 
				operadores={operadores}
				maquinas={maquinas}
				loading={loading}
				error={error}
				asignarMaquinas={asignarMaquinas}
			/>

			<ModalForm
				isOpen={modalOpen}
				onClose={handleCloseModal}
				title="Crear Nuevo Usuario"
				fields={fields}
				onSubmit={handleSubmit}
				loading={loading}
				error={actionError}
				success={success}
				initialValues={{ 
					Nombre: '', 
					Cargo: '', 
					Usuario: '', 
					Password: '', 
					confirmPassword: '' 
				}}
				validate={validateForm}
				submitButtonText="Crear Usuario"
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