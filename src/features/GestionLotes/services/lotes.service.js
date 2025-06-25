// services/lote.service.js
import api from "../../../shared/services/api";

export async function getAllLotes() {
	const response = await api.get("/lote");
	return response.data; // Retorna el array de lotes
}

export const createLote = (payload) =>
	api.post("/lote", payload).then((r) => r.data);

export const getLotesCertificados = async () => {
	const res = await api.get('/lote');
	// Filtrar lotes con estado 'certificado'
	return res.data.filter(lote => lote.Estado && lote.Estado.toLowerCase() === 'certificado');
};

export const getLotesAlmacenados = async () => {
	const res = await api.get('/lote');
	return res.data.filter(lote => lote.Estado && lote.Estado.toLowerCase() === 'almacenado');
};
