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
	FiTruck,
	FiShoppingCart,
	FiList,
	FiChevronDown,
	FiChevronRight,
} from "react-icons/fi";
import useUser from "../../features/Auth/hooks/useUser";
import useAuth from "../../features/Auth/hooks/useAuth";

export default function Sidebar({ onCollapse }) {
	const { pathname } = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const { user } = useUser();
	const { logout } = useAuth();
	const [openSections, setOpenSections] = useState({});

	const groupedLinks = [
		{
			title: "Inicio",
			links: [
				{ to: "/dashboard", label: "Dashboard", icon: <FiTruck />, admin:true},
				{ to: "/dashboard-cliente", label: "Dashboard Cliente", icon: <FiTruck />, cliente:true},
			],
		},
		{
			title: "Materia Prima",
			links: [
				{ to: "/materia-prima-base", label: "Materias Prima Base", icon: <FiPackage /> },
				{ to: "/solicitar-materia-prima", label: "Solicitar Materias Prima", icon: <FiPackage /> },
				{ to: "/recepcion-materia-prima", label: "Recepcion Materias Prima", icon: <FiPackage /> },
				{ to: "/proveedores", label: "Proveedores", icon: <FiTruck />, admin: true },
			],
		},
		{
			title: "Lote",
			links: [
				{ to: "/gestion-lotes", label: "Lotes", icon: <FiBox /> },
			],
		},
		{
			title: "Procesos",
			links: [
				{ to: "/maquinas", label: "Maquinas", icon: <FiTool />, admin: true },
				{ to: "/variables-estandar", label: "Variables Estandar", icon: <FiTool />, admin: true },
				{ to: "/procesos", label: "Procesos", icon: <FiBox />, admin: true },
			],
		},
		{
			title: "Certificacion",
			links: [
				{ to: "/seleccionar-lote", label: "Certificar Lote", icon: <FiUsers /> },
				{ to: "/certificados", label: "Certificados", icon: <FiClipboard /> }
			],
		},
		{
			title: "Almacen",
			links: [
				{ to: "/almacenaje", label: "Almacenar lotes", icon: <FiHome /> },
				{ to: "/lotes-almacenados", label: "Lotes almacenados", icon: <FiList /> },
			],
		},
		{
			title: "Pedidos",
			links: [
				{ to: "/pedidos", label: "Mis Pedidos", icon: <FiShoppingCart />, cliente: true },
				{ to: "/gestion-pedidos", label: "Gestión de Pedidos", icon: <FiList />, admin: true },
			],
		},
		{
			title: "Administración",
			links: [
				{ to: "/usuarios", label: "Usuarios", icon: <FiUsers />, admin: true },
			],
		},
	];

	const getVisibleLinks = (links) => {
		if (user?.Cargo === "admin") return links;
		if (user?.Cargo === "cliente") return links.filter(l => l.cliente);
		return links.filter(l => !l.admin && !l.cliente);
	};

	const toggleSidebar = () => {
		const newCollapsed = !collapsed;
		setCollapsed(newCollapsed);
		onCollapse(newCollapsed);
	};

	const handleSectionClick = (title) => {
		setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
	};

	return (
		<aside
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: collapsed ? "60px" : "220px",
				background: "#007c64",
				color: "white",
				height: "100vh",
				padding: "1rem 0.5rem",
				overflowY: "auto",
				transition: "width 0.2s",
				zIndex: 1000,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between"
			}}
		>
			<div>
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
					{groupedLinks.map((section) => {
						const visibleLinks = getVisibleLinks(section.links);
						if (visibleLinks.length === 0) return null;
						const isOpen = openSections[section.title] || false;
						return (
							<div key={section.title} style={{ marginBottom: "1.5rem" }}>
								<button
									onClick={() => handleSectionClick(section.title)}
									style={{
										display: "flex",
										alignItems: "center",
										width: "100%",
										background: "none",
										border: "none",
										color: "white",
										fontWeight: 700,
										fontSize: "0.95rem",
										letterSpacing: "0.04em",
										margin: "0.5rem 0 0.2rem 0.5rem",
										padding: 0,
										cursor: "pointer",
										opacity: 0.7,
									}}
								>
									{isOpen ? <FiChevronDown /> : <FiChevronRight />}
									{!collapsed && <span style={{ marginLeft: 8 }}>{section.title}</span>}
								</button>
								{isOpen && (
									<div>
										{visibleLinks.map((link) => (
											<Link
												key={link.to}
												to={link.to}
												style={{
													display: "flex",
													alignItems: "center",
													color: "white",
													padding: "0.5rem 0.5rem 0.5rem 1.5rem",
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
									</div>
								)}
							</div>
						);
					})}
				</nav>
			</div>

			<div style={{ marginTop: "auto", padding: collapsed ? "0.5rem" : "1rem" }}>
				<button
					onClick={logout}
					className="btn btn-primary w-full"
					style={{
						padding: collapsed ? "0.5rem" : "0.75rem 1rem",
						fontSize: "1rem",
						fontWeight: 600,
						marginTop: "1rem"
					}}
				>
					{!collapsed ? "Cerrar sesión" : <FiUsers />}
				</button>
			</div>
		</aside>
	);
}
