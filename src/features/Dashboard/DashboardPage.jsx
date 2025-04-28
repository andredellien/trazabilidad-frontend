import React from "react";
import LoteList from "../GestionLotes/components/LoteList.jsx";
import { useNavigate } from "react-router-dom";
import useAuth from "../Auth/hooks/useAuth.js";

const DashboardPage = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const cards = [
		{
			title: "Recepción de Materia Prima",
			description: "Registra la entrada de materia prima al sistema",
			buttonText: "Administrar",
			onClick: () => navigate("/materia-prima"),
		},
		{
			title: "Gestión de Lotes",
			description: "Administra los lotes de producción",
			buttonText: "Administrar",
			onClick: () => navigate("/gestion-lotes"),
		},
		{
			title: "Códigos QR",
			description: "Ver o descargar códigos QR existentes",
			buttonText: "Entrar para ver",
			secondaryButton: "Descargar",
			onClick: () => navigate("/codigo-qr"),
		},
		{
			title: "Certificados de Calidad",
			description: "Consulta y descarga certificados de calidad",
			buttonText: "Ver Certificados",
			onClick: () => navigate("/certificados"),
		},
	];

	return (
		<div className="dashboard-container">
			<div className="header">
				<h1 className="dashboard-title">Panel de Control</h1>
				<button onClick={logout} className="sign-out-button">
					Cerrar Sesion
				</button>
			</div>

			<div className="dashboard-grid">
				{cards.map((card, i) => (
					<div key={i} className="dashboard-card">
						<h3>{card.title}</h3>
						<p>{card.description}</p>
						<button onClick={card.onClick}>{card.buttonText}</button>
						{card.secondaryButton && (
							<button className="secondary">{card.secondaryButton}</button>
						)}
					</div>
				))}
			</div>

			<h2 className="dashboard-subtitle">Últimos Lotes Creados</h2>
			<LoteList />
		</div>
	);
};

export default DashboardPage;
