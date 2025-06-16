import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { getAllLotes } from "../services/lotes.service";

ChartJS.register(ArcElement, Tooltip);

function EstadoChartMini({ label, value, color }) {
	const chartData = {
		labels: [label, "Otros"],
		datasets: [
			{
				data: [value, 100 - value],
				backgroundColor: [color, "#e5e7eb"],
				borderWidth: 0,
			},
		],
	};

	return (
		<div className="flex flex-col items-center bg-white p-4 rounded-lg shadow w-[180px] h-[180px]">
			<div className="w-24 h-24">
				<Doughnut
					data={chartData}
					options={{
						cutout: "70%",
						plugins: { legend: { display: false } },
					}}
				/>
			</div>
			<p className="mt-3 text-sm font-semibold text-gray-600">{label}</p>
			<p className="text-lg font-bold text-gray-800">{value.toFixed(0)}%</p>
		</div>
	);
}

export default function LoteEstadoCards() {
	const [porcentajes, setPorcentajes] = useState({
		certificado: 0,
		pendiente: 0,
		noCertificado: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const cargar = async () => {
			setLoading(true);
			try {
				const lotes = await getAllLotes();
				const total = lotes.length || 1;
				const estado = {
					certificado: 0,
					pendiente: 0,
					noCertificado: 0,
				};

				for (let lote of lotes) {
					const est = lote.Estado.toLowerCase();
					if (est === "certificado") estado.certificado++;
					else if (est === "pendiente") estado.pendiente++;
					else if (est === "no certificado") estado.noCertificado++;
				}

				setPorcentajes({
					certificado: (estado.certificado / total) * 100,
					pendiente: (estado.pendiente / total) * 100,
					noCertificado: (estado.noCertificado / total) * 100,
				});
				setError(null);
			} catch (err) {
				console.error("Error al cargar estados:", err);
				setError("Error al cargar los estados de los lotes");
			} finally {
				setLoading(false);
			}
		};
		cargar();
	}, []);

	if (loading) {
		return <div className="text-center text-gray-500">Cargando estadísticas...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500">{error}</div>;
	}

	return (
		<div className="flex flex-wrap gap-4 justify-center items-center">
			<EstadoChartMini
				label="Certificados"
				value={porcentajes.certificado}
				color="#007c64"
			/>
			<EstadoChartMini
				label="Pendientes"
				value={porcentajes.pendiente}
				color="#facc15"
			/>
			<EstadoChartMini
				label="No Certificados"
				value={porcentajes.noCertificado}
				color="#f87171"
			/>
		</div>
	);
}
