import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
	FiHome,
	FiPackage,
	FiBox,
	FiUsers,
	FiMenu,
	FiClipboard,
	FiTool,
} from "react-icons/fi";
import useUser from "../../features/Auth/hooks/useUser";

export default function Sidebar({ onCollapse }) {
	const { pathname } = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const { user, loading: loadingUser } = useUser();

	const baseLinks = [
		{ to: "/dashboard", label: "Inicio", icon: <FiHome /> },
		{ to: "/materia-prima", label: "Materias Primas", icon: <FiPackage /> },
		{ to: "/gestion-lotes", label: "Lotes", icon: <FiBox /> },
		{ to: "/maquinas", label: "Maquinas", icon: <FiTool /> },
		{ to: "/procesos", label: "Procesos", icon: <FiBox /> },
		{ to: "/seleccionar-lote", label: "Certificar Lote", icon: <FiUsers /> },
		{
			to: "/certificados",
			label: "Certificados",
			icon: <FiClipboard />,
		},
	];

	// Add Users link only for admin users
	const links = user?.Cargo === "admin" 
		? [...baseLinks, { to: "/usuarios", label: "Usuarios", icon: <FiUsers /> }]
		: baseLinks;

	const toggleSidebar = () => {
		const newCollapsed = !collapsed;
		setCollapsed(newCollapsed);
		onCollapse(newCollapsed); // 👈 Le avisa al padre (Layout)
	};

	return (
		<aside
			style={{
				position: "fixed", // 👈 Fijo en la pantalla
				top: 0, // Desde arriba
				left: 0, // Desde la izquierda
				width: collapsed ? "60px" : "220px",
				background: "#007c64",
				color: "white",
				height: "100vh", // Ocupa toda la altura
				padding: "1rem 0.5rem",
				overflowY: "auto", // Si es necesario, scroll interno
				transition: "width 0.2s",
				zIndex: 1000, // Para que esté encima de todo
			}}
		>
			<button
				onClick={toggleSidebar}
				style={{
					background: "transparent",
					border: "none",
					color: "white",
					cursor: "pointer",
					fontSize: "1.5rem",
					marginLeft: collapsed ? "0.2rem" : "0.5rem",
				}}
			>
				<FiMenu />
			</button>

			<nav style={{ marginTop: "2rem" }}>
				{links.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						style={{
							display: "flex",
							alignItems: "center",
							color: "white",
							padding: "0.5rem",
							textDecoration: "none",
							background: pathname === link.to ? "#005f4f" : "transparent",
							borderRadius: "6px",
							margin: "0.3rem 0",
						}}
					>
						<span
							style={{
								fontSize: "1.25rem",
								marginRight: collapsed ? "0" : "0.75rem",
							}}
						>
							{link.icon}
						</span>
						{!collapsed && <span>{link.label}</span>}
					</Link>
				))}
			</nav>
		</aside>
	);
}
