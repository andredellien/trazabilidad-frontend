import React from 'react';
import {
	Box,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	CircularProgress,
	Alert,
	Card,
	CardContent,
	Grid,
	IconButton,
	Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import useLotes from '../hooks/useLotes';

/**
 * Tabla de lotes con materias primas y cantidades
 */
export default function LoteList() {
	const { data: lotes, loading, error } = useLotes();

	const getEstadoChip = (estado) => {
		const estadoLower = estado?.toLowerCase();
		
		switch (estadoLower) {
			case 'certificado':
				return <Chip label="Certificado" color="success" variant="filled" size="small" />;
			case 'pendiente':
				return <Chip label="Pendiente" color="warning" variant="filled" size="small" />;
			case 'en proceso':
				return <Chip label="En Proceso" color="info" variant="filled" size="small" />;
			case 'completado':
				return <Chip label="Completado" color="success" variant="filled" size="small" />;
			case 'no certificado':
				return <Chip label="No Certificado" color="error" variant="filled" size="small" />;
			default:
				return <Chip label={estado || 'Sin estado'} color="default" variant="outlined" size="small" />;
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return 'Sin fecha';
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity="error" sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	if (!lotes || lotes.length === 0) {
		return (
			<Box textAlign="center" py={4}>
				<Typography variant="h6" color="text.secondary" gutterBottom>
					📦 No hay lotes registrados
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Cree su primer lote para comenzar
				</Typography>
			</Box>
		);
	}

	// Sort lots from newest to oldest
	const sortedLotes = [...lotes].sort((a, b) => 
		new Date(b.FechaCreacion) - new Date(a.FechaCreacion)
	);

	return (
		<Box>
			<Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
				📋 Lista de Lotes ({sortedLotes.length})
			</Typography>

			<TableContainer component={Paper} elevation={2}>
				<Table>
					<TableHead>
						<TableRow sx={{ backgroundColor: 'primary.main' }}>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Materias Primas</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedLotes.map((lote) => (
							<TableRow key={lote.IdLote} hover>
								<TableCell>
									<Typography variant="body2" fontWeight="bold" color="primary">
										#{lote.IdLote}
									</Typography>
								</TableCell>
								
								<TableCell>
									<Typography variant="body2" fontWeight="medium">
										{lote.Nombre || 'Sin nombre'}
									</Typography>
								</TableCell>
								
								<TableCell>
									{lote.MateriasPrimas && lote.MateriasPrimas.length > 0 ? (
										<Box>
											{lote.MateriasPrimas.map((mp, index) => (
												<Chip
													key={mp.IdMateriaPrimaBase || index}
													label={`${mp.Nombre} (${mp.Cantidad})`}
													size="small"
													variant="outlined"
													sx={{ mr: 0.5, mb: 0.5 }}
												/>
											))}
										</Box>
									) : (
										<Typography variant="body2" color="text.secondary">
											Sin materias primas
										</Typography>
									)}
								</TableCell>
								
								<TableCell>
									<Typography variant="body2" color="text.secondary">
										{lote.NombreCliente || 'Sin cliente'}
									</Typography>
								</TableCell>
								
								<TableCell>
									<Typography variant="body2">
										{formatDate(lote.FechaCreacion)}
									</Typography>
								</TableCell>
								
								<TableCell>
									{getEstadoChip(lote.Estado)}
								</TableCell>
								
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Vista de tarjetas para dispositivos móviles */}
			<Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
				<Grid container spacing={2}>
					{sortedLotes.map((lote) => (
						<Grid item xs={12} key={lote.IdLote}>
							<Card elevation={2}>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
										<Typography variant="h6" color="primary" fontWeight="bold">
											#{lote.IdLote}
										</Typography>
										{getEstadoChip(lote.Estado)}
									</Box>
									
									<Typography variant="body1" fontWeight="medium" gutterBottom>
										{lote.Nombre || 'Sin nombre'}
									</Typography>
									
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Cliente: {lote.NombreCliente || 'Sin cliente'}
									</Typography>
									
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Fecha: {formatDate(lote.FechaCreacion)}
									</Typography>
									
									{lote.MateriasPrimas && lote.MateriasPrimas.length > 0 && (
										<Box sx={{ mt: 2 }}>
											<Typography variant="body2" fontWeight="medium" gutterBottom>
												Materias Primas:
											</Typography>
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
												{lote.MateriasPrimas.map((mp, index) => (
													<Chip
														key={mp.IdMateriaPrimaBase || index}
														label={`${mp.Nombre} (${mp.Cantidad})`}
														size="small"
														variant="outlined"
													/>
												))}
											</Box>
										</Box>
									)}
									
									<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
										<Tooltip title="Ver detalles">
											<IconButton size="small" color="primary">
												<VisibilityIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="Editar lote">
											<IconButton size="small" color="secondary">
												<EditIcon />
											</IconButton>
										</Tooltip>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
}
