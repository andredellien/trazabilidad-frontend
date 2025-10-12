import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi"; // para ícono visual
import { getAllMaquinas, createMaquina, uploadMaquinaImage } from "./services/maquinas.service";
import { Box, Container, Button, Typography, Grid, Card, CardMedia, CardContent, Alert, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ModalForm } from '../../shared/components';
import Modal from "../../shared/components/Modal";

export default function Maquinas() {
	const [maquinas, setMaquinas] = useState([]);
	const [refresh, setRefresh] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [uploadingImage, setUploadingImage] = useState(false);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });

	useEffect(() => {
		cargarMaquinas();
	}, [refresh]);

	const cargarMaquinas = async () => {
		try {
			const data = await getAllMaquinas();
			setMaquinas(data);
		} catch (error) {
			console.error("Error al cargar máquinas:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al cargar las máquinas",
				type: "error"
			});
		}
	};

	const handleCreated = () => setRefresh(r => r + 1);

	const handleOpenModal = () => {
		setModalOpen(true);
		setError('');
		setSuccess('');
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setError('');
		setSuccess('');
	};

	const handleImageUpload = async (file) => {
		if (!file) return null;
		
		setUploadingImage(true);
		try {
			const response = await uploadMaquinaImage(file);
			return response.imageUrl;
		} catch (error) {
			console.error("Error al subir imagen:", error);
			throw new Error("Error al subir la imagen");
		} finally {
			setUploadingImage(false);
		}
	};

	const handleSubmit = async (formData) => {
		setLoading(true);
		setError('');
		setSuccess('');
		
		try {
			let imagenUrl = formData.imagenUrl;
			
			// Si hay un archivo de imagen, subirlo primero
			if (formData.imagenFile) {
				imagenUrl = await handleImageUpload(formData.imagenFile);
			}

			await createMaquina({ 
				nombre: formData.nombre.trim(), 
				imagenUrl 
			});
			
			setSuccess('Máquina creada exitosamente');
			setTimeout(() => {
				setSuccess('');
				handleCloseModal();
				handleCreated();
			}, 2000);
		} catch (err) {
			setError(err.response?.data?.message || err.message || 'Error al crear la máquina');
		} finally {
			setLoading(false);
		}
	};

	const validateForm = (formData) => {
		const errors = {};
		if (!formData.nombre?.trim()) {
			errors.nombre = 'El nombre es obligatorio';
		}
		if (!formData.imagenFile) {
			errors.imagenFile = 'La imagen es obligatoria';
		}
		return errors;
	};

	const fields = [
		{
			name: 'nombre',
			label: 'Nombre de la máquina',
			type: 'text',
			required: true,
			autoFocus: true,
			placeholder: 'Ej: Balanza automática'
		},
		{
			name: 'imagenFile',
			label: 'Imagen de la máquina',
			type: 'file',
			required: true,
			accept: 'image/*'
		}
	];

	return (
		<Container maxWidth={false} sx={{ py: 4 }}>
			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
				showConfirmButton={modal.showConfirmButton}
			/>

			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h4" fontWeight={600}>
					Gestión de Máquinas
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleOpenModal}
					size="small"
				>
					Crear Nueva Máquina
				</Button>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Typography variant="body1" color="text.secondary">
					Administra y registra las máquinas del sistema
				</Typography>
			</Box>

			{/* Lista de máquinas - Diseño original */}
			<div className="bg-white shadow rounded p-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-6">
					Máquinas registradas ({maquinas.length})
				</h3>
				
				{maquinas.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<FiUploadCloud className="text-6xl mx-auto mb-3" />
						</div>
						<p className="text-gray-500 text-lg">
							No hay máquinas registradas
						</p>
						<p className="text-gray-400">
							Agrega tu primera máquina usando el botón "Crear Nueva Máquina"
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-6">
						{maquinas.map((m) => (
							<div
								key={m.IdMaquina}
								className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
							>
								<div className="mb-4">
									<img
										src={m.ImagenUrl}
										alt={m.Nombre}
										className="w-full h-48 object-contain rounded border bg-white"
									/>
								</div>
								<div className="text-center">
									<p className="font-semibold text-gray-800 text-lg">
										{m.Nombre}
									</p>
									<p className="text-sm text-gray-500 mt-1">
										ID: #{m.IdMaquina}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<ModalForm
				isOpen={modalOpen}
				onClose={handleCloseModal}
				title="Crear Nueva Máquina"
				fields={fields}
				onSubmit={handleSubmit}
				loading={loading || uploadingImage}
				error={error}
				success={success}
				initialValues={{ nombre: '', imagenFile: null }}
				validate={validateForm}
				submitButtonText="Crear Máquina"
				maxWidth="sm"
			/>
		</Container>
	);
}