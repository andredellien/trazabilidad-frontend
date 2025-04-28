import axios from "axios";
import api from "../../../shared/services/api";

const API = "http://localhost:3000/api/materia-prima"; // cambia a la URL de Render cuando publiques

export async function createMateriaPrima(data) {
	// data = { Nombre, FechaRecepcion, Proveedor, Cantidad }
	const res = await axios.post(API, data);
	return res.data; // { message: 'Materia prima creada exitosamente' }
}

export async function getAllMateriasPrimas() {
	const res = await api.get("/materia-prima");
	return res.data;
}
