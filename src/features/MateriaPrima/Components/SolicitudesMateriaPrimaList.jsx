import React, { useEffect, useState } from "react";
import { StandardList } from "../../../shared/components";
import { getAllMateriasPrimas } from "../services/materiaPrima.service";

export default function SolicitudesMateriaPrimaList({ refresh }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchData = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await getAllMateriasPrimas();
			// Filtrar solo las solicitudes en estado 'solicitado'
			setData(
				Array.isArray(res) ? res.filter((mp) => mp.Estado === "solicitado") : []
			);
		} catch (err) {
			setError("Error al cargar solicitudes de materia prima");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, [refresh]);

	// Configuración de columnas para StandardList
	const columns = [
		{ key: "Nombre", label: "Nombre", align: "left" },
		{ key: "Cantidad", label: "Cantidad", align: "right", type: "number" },
		{ key: "Unidad", label: "Unidad", align: "center" },
		{ key: "Proveedor", label: "Proveedor", align: "left" },
		{
			key: "FechaRecepcion",
			label: "Fecha Solicitud",
			align: "center",
			type: "date",
		},
		{ key: "Estado", label: "Estado", align: "center", type: "status" },
	];

	// Asegurarse de que data sea siempre un array
	const safeData = Array.isArray(data) ? data : [];

	return (
		<StandardList
			data={safeData}
			columns={columns}
			loading={loading}
			error={error}
			title="Solicitudes de Materia Prima (Pendientes)"
			emptyMessage="No hay solicitudes pendientes"
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
