import React from "react";
import { Box, Chip } from "@mui/material";
import { StandardList } from "../../../shared/components";
import useLotes from "../hooks/useLotes";

/**
 * Lista de lotes con materias primas y cantidades usando StandardList
 */
export default function LoteList() {
	const { data: lotes, loading, error } = useLotes();

	// Sort lots from newest to oldest
	const sortedLotes = [...(lotes || [])].sort(
		(a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion)
	);

	// Configuración de columnas para StandardList
	const columns = [
		{
			key: "IdLote",
			label: "ID",
			align: "center",
			render: (value) => `#${value}`,
		},
		{ key: "Nombre", label: "Nombre", align: "left" },
		{
			key: "MateriasPrimas",
			label: "Materias Primas",
			align: "left",
			render: (value) => {
				if (!value || value.length === 0) {
					return "Sin materias primas";
				}
				return (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{value.map((mp, index) => (
							<Chip
								key={mp.IdMateriaPrimaBase || index}
								label={`${mp.Nombre} (${mp.Cantidad})`}
								size="small"
								variant="outlined"
							/>
						))}
					</Box>
				);
			},
		},
		{ key: "NombreCliente", label: "Cliente", align: "left" },
		{
			key: "FechaCreacion",
			label: "Fecha Creación",
			align: "center",
			type: "date",
		},
		{ key: "Estado", label: "Estado", align: "center", type: "status" },
	];

	// Configuración de acciones
	const actions = [
		{
			type: "view",
			tooltip: "Ver detalles del lote",
			label: "Ver",
		},
		{
			type: "edit",
			tooltip: "Editar lote",
			label: "Editar",
		},
	];

	// Manejar acciones
	const handleAction = (actionType, row) => {
		console.log(`Acción: ${actionType}`, row);
		// Aquí implementarías la lógica específica para cada acción
	};

	return (
		<StandardList
			data={sortedLotes}
			columns={columns}
			actions={actions}
			loading={loading}
			error={error}
			title=""
			emptyMessage="No hay lotes registrados"
			onAction={handleAction}
			showSearch={false}
			sx={{
				width: "100%",
				p: { xs: 1, md: 3 },
				boxShadow: 3,
				borderRadius: 2,
				bgcolor: "background.paper",
				overflowX: "auto",
			}}
		/>
	);
}
