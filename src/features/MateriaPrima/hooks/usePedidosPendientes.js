import { useState, useEffect } from "react";
import api from "../../../shared/services/api";

export default function usePedidosPendientes() {
	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchPedidosPendientes = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get("/pedido");
			// Filtrar pedidos en estado "pendiente" o "materia prima solicitada"
			const pedidosPendientes = response.data.filter(
				(pedido) => pedido.Estado === "pendiente" || pedido.Estado === "materia prima solicitada"
			);
			setPedidos(pedidosPendientes);
		} catch (err) {
			console.error("Error al obtener pedidos pendientes:", err);
			setError(err.response?.data?.message || "Error al cargar los pedidos pendientes");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPedidosPendientes();
	}, []);

	return { pedidos, loading, error, refetch: fetchPedidosPendientes };
} 