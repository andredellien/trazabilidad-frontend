import React, { useEffect, useState } from "react";
import LoteList from "../GestionLotes/components/LoteList.jsx";
import LoteEstadoChart from "../GestionLotes/components/LoteEstadoChart.jsx";
import useAuth from "../Auth/hooks/useAuth.js";
import { getAllLotes } from "../GestionLotes/services/lotes.service.js";
import { DonutChartFillableHalf } from "../../shared/components/chart.js";

const DashboardPage = () => {
	const { logout } = useAuth();

	const [lotes, setLotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchLotes = async () => {
		setLoading(true);
		try {
			const data = await getAllLotes();
			setLotes(data);
			setError(null);
		} catch (e) {
			console.error(e);
			setError("Error al cargar los lotes");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLotes();
	}, []);

	return (
		<div className="dashboard-container">
			<div className="header">
				<h1 className="dashboard-title">Panel de Control</h1>
				<button onClick={logout} className="sign-out-button">
					Cerrar Sesión
				</button>
			</div>

			<div>
				<h2 className="dashboard-subtitle">Reporte de Estado de Lotes</h2>
				<LoteEstadoChart />
			</div>

			<h2 className="dashboard-subtitle">Últimos Lotes Creados</h2>
			<LoteList lotes={lotes} loading={loading} error={error} />
		</div>
	);
};

export default DashboardPage;
