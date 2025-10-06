import React, { useState, useEffect } from 'react';
import {
	Box,
	TextField,
	Button,
	Typography,
	Alert,
	CircularProgress,
	Card,
	CardContent,
	Grid,
	Chip,
	IconButton,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	InputAdornment,
	Tooltip,
	Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import NumberStepper from '../../../shared/components/NumberStepper';
import { createLote } from '../services/lotes.service';
import { getAllMateriaPrimaBase } from '../../MateriaPrima/services/materiaPrima.service';
import { getAllProcesos } from '../../Proceso/services/proceso.service';
import { getAllPedidos } from '../../Pedidos/services/pedido.service';

export default function LoteForm({ onCreated }) {
	const [formData, setFormData] = useState({
		Nombre: '',
		IdPedido: '',
		MateriasPrimas: []
	});
	const [materiasPrimasBase, setMateriasPrimasBase] = useState([]);
	const [procesos, setProcesos] = useState([]);
	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [materiasRes, procesosRes, pedidosRes] = await Promise.all([
					getAllMateriaPrimaBase(),
					getAllProcesos(),
					getAllPedidos()
				]);
				setMateriasPrimasBase(materiasRes);
				setProcesos(procesosRes);
				setPedidos(pedidosRes);
			} catch (err) {
				setError('Error al cargar datos iniciales');
			}
		};
		fetchData();
	}, []);

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleAddMateriaPrima = () => {
		setFormData(prev => ({
			...prev,
			MateriasPrimas: [
				...prev.MateriasPrimas,
				{
					IdMateriaPrimaBase: '',
					Cantidad: '',
				}
			]
		}));
	};

	const handleMateriaPrimaChange = (index, field, value) => {
		setFormData(prev => {
			const newMateriasPrimas = [...prev.MateriasPrimas];
			newMateriasPrimas[index] = {
				...newMateriasPrimas[index],
				[field]: value
			};
			return {
				...prev,
				MateriasPrimas: newMateriasPrimas
			};
		});
	};

	const handleRemoveMateriaPrima = (index) => {
		setFormData(prev => ({
			...prev,
			MateriasPrimas: prev.MateriasPrimas.filter((_, i) => i !== index)
		}));
	};

	const validateForm = () => {
		if (!formData.Nombre.trim()) {
			setError('El nombre del lote es obligatorio');
			return false;
		}
		if (formData.MateriasPrimas.length === 0) {
			setError('Debe agregar al menos una materia prima');
			return false;
		}
		for (let mp of formData.MateriasPrimas) {
			if (!mp.IdMateriaPrimaBase || !mp.Cantidad) {
				setError('Complete todos los campos de materias primas');
				return false;
			}
			if (parseFloat(mp.Cantidad) <= 0) {
				setError('Las cantidades deben ser mayores a 0');
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!validateForm()) return;

		setLoading(true);
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
				})),
			};

			await createLote(loteData);
			setSuccess('Lote creado exitosamente');
			setFormData({
				Nombre: '',
				IdPedido: '',
				MateriasPrimas: []
			});
			if (onCreated) onCreated();
		} catch (err) {
			setError(err.response?.data?.message || 'Error al crear el lote');
		} finally {
			setLoading(false);
		}
	};

	const pedidosFiltrados = pedidos.filter(p => p.Estado === 'pendiente' || p.Estado === 'materia prima solicitada');

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1000, mx: 'auto', p: 1 }}>
			<Card elevation={4} sx={{ borderRadius: 3 }}>
				<CardContent sx={{ p: 4 }}>

					
					<Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
						Complete la información del lote y seleccione las materias primas necesarias
					</Typography>

					{error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
					{success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

					<Box component="form" onSubmit={handleSubmit}>
						{/* Sección de Información Básica */}
						<Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
							<Typography variant="h5" gutterBottom color="primary" fontWeight="600" sx={{ mb: 2 }}>
									Información del Lote
								</Typography>
							<Divider sx={{ mb: 3 }} />
							
							<Grid container spacing={3}>

							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label="Nombre del Lote"
									value={formData.Nombre}
									onChange={(e) => handleInputChange('Nombre', e.target.value)}
									required
									placeholder="Ej: Lote de producción #001"
										variant="outlined"
										size="medium"
										sx={{
										'& .MuiInputLabel-root': {
											fontSize: '1rem',
											fontWeight: 500
										}
									}}
								/>
							</Grid>

								<Grid item xs={12} md={6}>
									<FormControl fullWidth variant="outlined" size="medium">
										<InputLabel sx={{ fontSize: '1rem', fontWeight: 500,}}>
											Pedido Asociado 
										</InputLabel>
										<Select
											value={formData.IdPedido}
												label="Pedido Asociado"
											onChange={(e) => handleInputChange('IdPedido', e.target.value)}
												sx={{
												'& .MuiSelect-select': {
													fontSize: '1rem'
												},
												minWidth: 200
											}}
										>
											<MenuItem value="">Sin pedido asociado</MenuItem>
											{pedidosFiltrados.map(pedido => (
												<MenuItem key={pedido.IdPedido} value={pedido.IdPedido}>
													Pedido #{pedido.IdPedido} - {pedido.Descripcion || "Sin descripción"}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Grid>
						</Paper>

						{/* Sección de Materias Primas */}
						<Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
								<Typography variant="h5" color="primary" fontWeight="600">
										Materias Primas Base
									</Typography>
								<Button
									variant="contained"
										startIcon={<AddIcon />}
										onClick={handleAddMateriaPrima}
										disabled={loading}
									size="small"
								>
									Agregar Materia Prima
								</Button>
							</Box>
							<Divider sx={{ mb: 3 }} />

							{formData.MateriasPrimas.length === 0 && (
								<Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
									No hay materias primas base agregadas. Haga clic en "Agregar Materia Prima" para comenzar.
								</Alert>
							)}

							{formData.MateriasPrimas.map((materia, index) => {
								const materiaBase = materiasPrimasBase.find(mp => mp.IdMateriaPrimaBase === Number(materia.IdMateriaPrimaBase));
								const disponible = materiaBase ? materiaBase.Cantidad : 0;
								const excede = materia.Cantidad && Number(materia.Cantidad) > disponible;

								return (
									<Card key={index} variant="outlined" sx={{ p: 3, mb: 2, borderRadius: 2, borderColor: excede ? 'error.main' : 'divider' }}>
										<Grid container spacing={3} alignItems="center">
											<Grid item xs={12} md={5}>
												<FormControl fullWidth variant="outlined" size="medium">
													<InputLabel sx={{ fontSize: '1rem', fontWeight: 500 }}>
														Materia Prima Base
													</InputLabel>
													<Select
														value={materia.IdMateriaPrimaBase}
														label="Materia Prima Base"
														onChange={(e) => handleMateriaPrimaChange(index, 'IdMateriaPrimaBase', e.target.value)}
														required
														sx={{
														'& .MuiSelect-select': {
															fontSize: '1rem'
														},
														minWidth: 200
													}}
													>
														{materiasPrimasBase.map(mp => (
															<MenuItem key={mp.IdMateriaPrimaBase} value={mp.IdMateriaPrimaBase}>
																{mp.Nombre} ({mp.Unidad})
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>

											<Grid item xs={12} md={3}>
												<NumberStepper
													label="Cantidad Requerida"
													value={Number(materia.Cantidad) || 0}
													onChange={(v) => handleMateriaPrimaChange(index, 'Cantidad', v)}
													min={0}
													step={0.01}
													unit={materiaBase?.Unidad}
													error={excede}
													helperText={excede ? `Excede disponible (${disponible} ${materiaBase?.Unidad})` : ''}
												/>
											</Grid>

											<Grid item xs={12} md={3}>
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<Chip 
														label={`Disponible: ${disponible} ${materiaBase?.Unidad || ''}`}
														color={excede ? 'error' : 'primary'}
														variant={excede ? 'filled' : 'outlined'}
														size="medium"
														sx={{ 
															fontWeight: 600,
															fontSize: '0.875rem'
														}}
													/>
												</Box>
											</Grid>

										<Grid item xs={12} md={1}>
											<Tooltip title="Eliminar materia prima" placement="top">
												<IconButton
													color="error"
													onClick={() => handleRemoveMateriaPrima(index)}
													disabled={loading}
													sx={{ 
														bgcolor: 'error.light',
														color: 'white',
														'&:hover': {
															bgcolor: 'error.main'
														}
													}}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</Grid>
									</Grid>
								</Card>
								);
							})}
						</Paper>

							{/* Botón de envío */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
								<Button
									type="submit"
									variant="contained"
									size="small"
									disabled={loading || formData.MateriasPrimas.length === 0}
								>
									{loading ? (
										<>
											<CircularProgress size={24} sx={{ mr: 2 }} />
												Creando Lote...
										</>
									) : (
										'Crear Lote'
									)}
								</Button>
						</Box>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
