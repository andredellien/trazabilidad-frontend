import React, { useState, useEffect } from 'react';
import LoteList from './components/LoteList';
import LoteStats from './components/LoteStats';
import useLotes from './hooks/useLotes';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { ModalForm } from '../../shared/components';
import { createLote } from './services/lotes.service';
import { getAllMateriaPrimaBase } from '../MateriaPrima/services/materiaPrima.service';
import { getAllPedidos } from '../Pedidos/services/pedido.service';
import { Box, Typography, Container, CircularProgress, Button as MuiButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import './styles/Lotes.css';

export default function GestionLotesPage() {
	const [refreshList, setRefreshList] = useState(0);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingData, setLoadingData] = useState(true);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	
	// Datos para los selects
	const [materiasPrimasBase, setMateriasPrimasBase] = useState([]);
	const [pedidos, setPedidos] = useState([]);
	
	const { data: lotes } = useLotes();

	const handleLoteCreated = () => {
		setRefreshList(prev => prev + 1);
	};

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

	// Cargar datos iniciales
	useEffect(() => {
		const fetchData = async () => {
			setLoadingData(true);
			try {
				const [materiasRes, pedidosRes] = await Promise.all([
					getAllMateriaPrimaBase(),
					getAllPedidos()
				]);
				setMateriasPrimasBase(Array.isArray(materiasRes) ? materiasRes : []);
				setPedidos(Array.isArray(pedidosRes) ? pedidosRes : []);
			} catch (err) {
				setError('Error al cargar datos iniciales');
			} finally {
				setLoadingData(false);
			}
		};
		fetchData();
	}, []);

	const handleSubmit = async (formData) => {
		setLoading(true);
		setError('');
		setSuccess('');
		
		try {
			const loteData = {
				Nombre: formData.Nombre,
				FechaCreacion: new Date().toISOString().split('T')[0],
				Estado: 'Pendiente',
				IdProceso: null,
				IdPedido: formData.IdPedido ? parseInt(formData.IdPedido) : null,
				MateriasPrimas: formData.MateriasPrimas.map((mp) => ({
					IdMateriaPrimaBase: parseInt(mp.IdMateriaPrimaBase),
					Cantidad: parseFloat(mp.Cantidad)
				}))
			};

			await createLote(loteData);
			setSuccess('Lote creado exitosamente');
			setTimeout(() => {
				setSuccess('');
				handleCloseModal();
				handleLoteCreated();
			}, 2000);
		} catch (err) {
			setError(err.response?.data?.message || 'Error al crear el lote');
		} finally {
			setLoading(false);
		}
	};

	const validateForm = (formData) => {
		const errors = {};
		if (!formData.Nombre?.trim()) {
			errors.Nombre = 'El nombre del lote es obligatorio';
		}
		if (!formData.MateriasPrimas || formData.MateriasPrimas.length === 0) {
			errors.MateriasPrimas = 'Debe agregar al menos una materia prima';
		} else {
			formData.MateriasPrimas.forEach((mp, index) => {
				if (!mp.IdMateriaPrimaBase) {
					errors[`MateriasPrimas[${index}].IdMateriaPrimaBase`] = 'Debe seleccionar una materia prima base';
				}
				if (!mp.Cantidad || mp.Cantidad <= 0) {
					errors[`MateriasPrimas[${index}].Cantidad`] = 'La cantidad debe ser mayor a 0';
				}
			});
		}
		return errors;
	};

	const pedidosFiltrados = pedidos.filter(p => p.Estado === 'pendiente' || p.Estado === 'materia prima solicitada');

	const fields = [
		{
			name: 'Nombre',
			label: 'Nombre del Lote',
			type: 'text',
			required: true,
			placeholder: 'Ej: Lote de producción #001'
		},
		{
			name: 'IdPedido',
			label: 'Pedido Asociado',
			type: 'select',
			required: false,
			options: [
				{ value: '', label: 'Sin pedido asociado' },
				...pedidosFiltrados.map(pedido => ({
					value: pedido.IdPedido,
					label: `Pedido #${pedido.IdPedido} - ${pedido.Descripcion || "Sin descripción"}`
				}))
			]
		}
	];

	const dynamicLists = [
		{
			name: 'MateriasPrimas',
			title: 'Materias Primas Base',
			addButtonText: 'Agregar Materia Prima',
			customSpacing: {
				minHeight: 'auto',
				containerSx: {
					flexDirection: 'column',
					gap: 2,
					padding: 2
				},
				fieldSx: {
					width: '100%',
					marginBottom: 1
				},
				deleteButtonPadding: '0px'
			},
			fields: [
				{
					name: 'IdMateriaPrimaBase',
					label: 'Materia Prima Base',
					type: 'select',
					width: 1,
					options: materiasPrimasBase.map(mp => ({
						value: mp.IdMateriaPrimaBase,
						label: `${mp.Nombre} (${mp.Unidad})`
					}))
				},
				{
					name: 'Cantidad',
					label: 'Cantidad',
					type: 'number',
					width: 1,
					min: 0,
					step: 0.01
				}
			]
		}
	];

	if (loadingData) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Box display="flex" justifyContent="center" my={4}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h4" fontWeight={600}>
					Gestión de Lotes
				</Typography>
			</Box>

			<Box sx={{ mb: 3 }}>
				<Typography variant="body1" color="text.secondary">
					Administre la creación y seguimiento de lotes de producción
				</Typography>
			</Box>

			{/* Estadísticas */}
			<Box sx={{ mb: 4 }}>
				<LoteStats lotes={lotes} />
			</Box>

			{/* Botón Crear Lote */}
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
				<MuiButton 
					onClick={handleOpenModal} 
					startIcon={<AddIcon />} 
					variant="contained" 
					color="primary" 
					size="small" 
					sx={{ mb: 2, minWidth: 120 }}
				>
					Crear Lote
				</MuiButton>
			</Box>

			{/* Lista de Lotes */}
			<Box>
				<LoteList key={refreshList} />
			</Box>

			<ModalForm
				isOpen={modalOpen}
				onClose={handleCloseModal}
				title="Crear Lote"
				fields={fields}
				dynamicLists={dynamicLists}
				onSubmit={handleSubmit}
				loading={loading}
				error={error}
				success={success}
				initialValues={{ 
					Nombre: '', 
					IdPedido: '', 
					MateriasPrimas: [] 
				}}
				validate={validateForm}
				submitButtonText="Crear Lote"
				maxWidth="sm"
			/>
		</Container>
	);
}
