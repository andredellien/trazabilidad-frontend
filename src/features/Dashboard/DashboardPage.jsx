import React, { useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import useUser from "../Auth/hooks/useUser.js";
import usePedidos from "../Pedidos/hooks/usePedidos.js";
import useLotes from "../GestionLotes/hooks/useLotes.js";
import useAuth from "../Auth/hooks/useAuth.js";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";

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

	return (
		<div className="p-4 min-h-screen bg-secondary">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					{!loadingUser && user && (
						<div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
							{user.Nombre.charAt(0).toUpperCase()}
						</div>
					)}
					<div>
						<h1 className="text-3xl font-bold text-primary">Bienvenido, {user?.Nombre || "Usuario"}</h1>
						<p className="text-secondary">{user?.Cargo}</p>
					</div>
				</div>
			</div>

			{/* KPIs - Fila 1: 4 columnas */}
			<div className="grid grid-cols-4 gap-4 mb-6">
				{[{
					label: "Pedidos Totales",
					value: totalPedidos,
					color: "primary"
				}, {
					label: "Lotes Totales",
					value: totalLotes,
					color: "success"
				}, {
					label: "Pedidos Pendientes",
					value: pedidosPorEstado[0],
					color: "warning"
				}, {
					label: "Lotes Certificados",
					value: lotesPorEstado[2],
					color: "success"
				}].map((kpi, i) => (
					<Card key={kpi.label} className="border-l-4 border-primary">
						<div className="p-4">
							<p className="text-sm text-secondary mb-2">{kpi.label}</p>
							<p className="text-3xl font-bold text-primary">{kpi.value}</p>
						</div>
					</Card>
				))}
			</div>

			{/* Gráficas - Fila 2: 2 columnas */}
			<div className="grid grid-cols-2 gap-6 mb-6">
				{/* Gráfica de Pedidos */}
				<Card title="Estado de Pedidos">
					{loadingPedidos ? (
						<div className="flex justify-center items-center h-64">
							<div className="text-primary">Cargando...</div>
						</div>
					) : (
						<div className="h-64">
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
						</div>
					)}
				</Card>

				{/* Gráfica de Lotes */}
				<Card title="Estado de Lotes">
					{loadingLotes ? (
						<div className="flex justify-center items-center h-64">
							<div className="text-primary">Cargando...</div>
						</div>
					) : (
						<div className="h-64">
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
						</div>
					)}
				</Card>
			</div>

			{/* Actividad Reciente - Fila 3: 2 columnas */}
			<div className="grid grid-cols-2 gap-6">
				{/* Últimos Pedidos */}
				<Card title="Últimos Pedidos">
					{loadingPedidos ? (
						<div className="text-center text-secondary">Cargando...</div>
					) : ultimosPedidos.length === 0 ? (
						<div className="text-center text-secondary">No hay pedidos recientes</div>
					) : (
						<div className="space-y-3">
							{ultimosPedidos.map((pedido) => (
								<div key={pedido.IdPedido} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
									<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
										{pedido.NombreCliente ? pedido.NombreCliente.charAt(0).toUpperCase() : "C"}
									</div>
									<div className="flex-1">
										<p className="font-semibold">Pedido #{pedido.IdPedido}</p>
										<p className="text-sm text-secondary">{pedido.Descripcion || "Sin descripción"}</p>
										<p className="text-xs text-muted">{new Date(pedido.FechaCreacion).toLocaleDateString()}</p>
									</div>
									<Badge variant="primary">{pedido.Estado}</Badge>
								</div>
							))}
						</div>
					)}
				</Card>

				{/* Últimos Lotes */}
				<Card title="Últimos Lotes">
					{loadingLotes ? (
						<div className="text-center text-secondary">Cargando...</div>
					) : ultimosLotes.length === 0 ? (
						<div className="text-center text-secondary">No hay lotes recientes</div>
					) : (
						<div className="space-y-3">
							{ultimosLotes.map((lote) => (
								<div key={lote.IdLote} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
									<div className="w-10 h-10 bg-primary rounded-full  flex items-center justify-center text-white font-bold">
										{lote.NombreCliente ? lote.NombreCliente.charAt(0).toUpperCase() : "C"}
									</div>
									<div className="flex-1">
										<p className="font-semibold">Lote #{lote.IdLote}</p>
										<p className="text-sm text-secondary">{lote.Nombre || "Sin nombre"}</p>
										<p className="text-xs text-muted">{new Date(lote.FechaCreacion).toLocaleDateString()}</p>
									</div>
									<Badge variant="success">{lote.Estado}</Badge>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default DashboardPage;