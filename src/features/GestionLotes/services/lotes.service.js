// services/lote.service.js
import api from "../../../shared/services/api";

export async function getAllLotes() {
	const response = await api.get("/lote");
	return response.data; // Retorna el array de lotes
}

export const createLote = (payload) =>
	api.post("/lote", payload).then((r) => r.data);
