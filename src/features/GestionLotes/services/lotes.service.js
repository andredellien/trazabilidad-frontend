// services/lote.service.js
import axios from "axios";
import api from "../../../shared/services/api";

// Puedes tener una constante con la URL base de tu API.
// Si estás en local: http://localhost:3000
// O el dominio donde esté alojado tu backend.
const API_BASE = "http://localhost:3000/api";

export async function getAllLotes() {
	const response = await axios.get(`${API_BASE}/lote`);
	return response.data; // Retorna el array de lotes
}

export const createLote = (payload) =>
	api.post("/lote", payload).then((r) => r.data);
