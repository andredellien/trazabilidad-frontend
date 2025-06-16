import api from "../../../shared/services/api";

export async function createMateriaPrima(data) {
	// data = { Nombre, FechaRecepcion, Proveedor, Cantidad }
	const res = await api.post("/materia-prima", data);
	return res.data;
}

export async function getAllMateriasPrimas() {
	const res = await api.get("/materia-prima");
	return res.data;
}
