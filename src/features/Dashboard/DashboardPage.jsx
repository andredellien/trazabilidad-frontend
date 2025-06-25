import React, { useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, CircularProgress, Tooltip, Chip, Fade, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import useUser from "../Auth/hooks/useUser.js";
import usePedidos from "../Pedidos/hooks/usePedidos.js";
import useLotes from "../GestionLotes/hooks/useLotes.js";
import useAuth from "../Auth/hooks/useAuth.js";

ChartJS.register(ArcElement, ChartTooltip, Legend, BarElement, CategoryScale, LinearScale);

const estadosPedido = [
	"pendiente",
	"materia prima solicitada",
	"en_proceso",
	"Produccion Finalizada",
	"Almacenado",
	"cancelado"
];
const coloresPedido = [
	"#facc15",
	"#fb923c",
	"#60a5fa",
	"#22c55e",
	"#a78bfa",
	"#f87171"
];
const estadosLote = [
	"pendiente",
	"en proceso",
	"certificado",
	"no certificado",
	"almacenado"
];
const coloresLote = [
	"#facc15",
	"#60a5fa",
	"#22c55e",
	"#f87171",
	"#a78bfa"
];

function getPedidosPorEstado(pedidos) {
	const counts = {};
	estadosPedido.forEach(e => (counts[e] = 0));
	pedidos.forEach(p => {
		const est = (p.Estado || "");
		if (counts[est] !== undefined) counts[est]++;
	});
	return estadosPedido.map(e => counts[e]);
}
function getLotesPorEstado(lotes) {
	const counts = {};
	estadosLote.forEach(e => (counts[e] = 0));
	lotes.forEach(l => {
		const est = (l.Estado || "").toLowerCase();
		if (counts[est] !== undefined) counts[est]++;
	});
	return estadosLote.map(e => counts[e]);
}

const DashboardPage = () => {
	const { logout } = useAuth();
	const { user, loading: loadingUser } = useUser();
	const { pedidos, loading: loadingPedidos, fetchPedidos } = usePedidos();
	const { data: lotes, loading: loadingLotes } = useLotes();

	useEffect(() => {
		fetchPedidos();
	}, []);

	// KPIs
	const totalPedidos = pedidos.length;
	const totalLotes = lotes.length;
	const pedidosPorEstado = getPedidosPorEstado(pedidos);
	const lotesPorEstado = getLotesPorEstado(lotes);

	// Últimos pedidos y lotes
	const ultimosPedidos = [...pedidos].sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion)).slice(0, 5);
	const ultimosLotes = [...lotes].sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion)).slice(0, 5);

	// Animación de cards
	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
	};

	return (
		<Box sx={{ p: { xs: 1, md: 4 }, minHeight: "100vh" }}>
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
				<Box display="flex" alignItems="center" gap={2}>
					{!loadingUser && user && (
						<Fade in>
							<Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, fontSize: 28 }}>
								{user.Nombre.charAt(0).toUpperCase()}
							</Avatar>
						</Fade>
					)}
					<Box>
						<Typography variant="h4" fontWeight="bold">Bienvenido, {user?.Nombre || "Usuario"}</Typography>
						<Typography variant="subtitle1" color="text.secondary">{user?.Cargo}</Typography>
					</Box>
				</Box>
				<Button onClick={logout} color="primary" variant="outlined" size="medium">
					Cerrar sesión
				</Button>
			</Box>
			<Grid container spacing={2}>
				{/* Columna izquierda: bienvenida, KPIs, gráficas */}
				<Grid item xs={12} md={5}>


					{/* KPIs */}
					<Grid container spacing={2} mb={3}>
						{[{
							label: "Pedidos Totales",
							value: totalPedidos,
							color: "#6366f1"
						}, {
							label: "Lotes Totales",
							value: totalLotes,
							color: "#22c55e"
						}, {
							label: "Pedidos Pendientes",
							value: pedidosPorEstado[0],
							color: "#facc15"
						}, {
							label: "Lotes Certificados",
							value: lotesPorEstado[2],
							color: "#22c55e"
						}].map((kpi, i) => (
							<Grid item xs={12} sm={6} key={kpi.label}>
								<motion.div
									custom={i}
									initial="hidden"
									animate="visible"
									variants={cardVariants}
								>
									<Card sx={{ borderLeft: `6px solid ${kpi.color}`, boxShadow: 3, borderRadius: 3 }}>
										<CardContent>
											<Typography variant="subtitle2" color="text.secondary">{kpi.label}</Typography>
											<Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mt: 1 }}>{kpi.value}</Typography>
										</CardContent>
									</Card>
								</motion.div>
							</Grid>
						))}
					</Grid>

					{/* Gráficas */}
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
								<Typography variant="h6" fontWeight="bold" mb={2}>Estado de Pedidos</Typography>
								{loadingPedidos ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> :
									<Doughnut
										data={{
											labels: estadosPedido.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
											datasets: [{
												data: pedidosPorEstado,
												backgroundColor: coloresPedido,
												borderWidth: 2
											}]
										}}
										options={{
											animation: { animateRotate: true, duration: 1200 },
											plugins: { legend: { position: "bottom" } }
										}}
									/>
								}
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
								<Typography variant="h6" fontWeight="bold" mb={2}>Estado de Lotes</Typography>
								{loadingLotes ? <Box display="flex" justifyContent="center"><CircularProgress /></Box> :
									<Bar
										data={{
											labels: estadosLote.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
											datasets: [{
												label: "Cantidad",
												data: lotesPorEstado,
												backgroundColor: coloresLote
											}]
										}}
										options={{
											animation: { duration: 1200 },
											plugins: { legend: { display: false } },
											scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
										}}
									/>
								}
							</Card>
						</Grid>
					</Grid>
				</Grid>

				{/* Columna derecha: últimos pedidos y lotes */}
				<Grid item xs={12} md={5}>
					<Grid container spacing={3} direction="row">
						<Grid item xs={12} sm={6}>
							<Card sx={{ borderRadius: 3, boxShadow: 2 }}>
								<CardContent>
									<Typography variant="h6" fontWeight="bold" mb={2}>Últimos Pedidos</Typography>
									{loadingPedidos ? <CircularProgress /> : ultimosPedidos.length === 0 ? <Typography color="text.secondary">No hay pedidos recientes</Typography> :
										ultimosPedidos.map((pedido, i) => (
											<motion.div key={pedido.IdPedido} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
												<Box display="flex" alignItems="center" gap={2} mb={1}>
													<Tooltip title={pedido.NombreCliente || "Cliente"} arrow>
														<Avatar sx={{ bgcolor: "#6366f1", width: 36, height: 36, fontSize: 18 }}>
															{pedido.NombreCliente ? pedido.NombreCliente.charAt(0).toUpperCase() : "C"}
														</Avatar>
													</Tooltip>
													<Box flex={1}>
														<Typography fontWeight="bold">Pedido #{pedido.IdPedido}</Typography>
														<Typography variant="body2" color="text.secondary">{pedido.Descripcion || "Sin descripción"}</Typography>
														<Typography variant="caption" color="text.secondary">{new Date(pedido.FechaCreacion).toLocaleDateString()}</Typography>
													</Box>
													<Chip label={pedido.Estado} color="primary" size="small" sx={{ textTransform: "capitalize" }} />
												</Box>
											</motion.div>
										))
									}
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Card sx={{ borderRadius: 3, boxShadow: 2 }}>
								<CardContent>
									<Typography variant="h6" fontWeight="bold" mb={2}>Últimos Lotes</Typography>
									{loadingLotes ? <CircularProgress /> : ultimosLotes.length === 0 ? <Typography color="text.secondary">No hay lotes recientes</Typography> :
										ultimosLotes.map((lote, i) => (
											<motion.div key={lote.IdLote} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
												<Box display="flex" alignItems="center" gap={2} mb={1}>
													<Tooltip title={lote.NombreCliente || "Cliente"} arrow>
														<Avatar sx={{ bgcolor: "#22c55e", width: 36, height: 36, fontSize: 18 }}>
															{lote.NombreCliente ? lote.NombreCliente.charAt(0).toUpperCase() : "C"}
														</Avatar>
													</Tooltip>
													<Box flex={1}>
														<Typography fontWeight="bold">Lote #{lote.IdLote}</Typography>
														<Typography variant="body2" color="text.secondary">{lote.Nombre || "Sin nombre"}</Typography>
														<Typography variant="caption" color="text.secondary">{new Date(lote.FechaCreacion).toLocaleDateString()}</Typography>
													</Box>
													<Chip label={lote.Estado} color="success" size="small" sx={{ textTransform: "capitalize" }} />
												</Box>
											</motion.div>
										))
									}
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

export default DashboardPage;
