import api from "../../../shared/services/api";

export async function createMateriaPrima(data) {
	// Asegurarse de que todos los campos requeridos estén presentes
	const materiaPrimaData = {
		Nombre: data.Nombre,
		FechaRecepcion: data.FechaRecepcion || new Date().toISOString().split('T')[0],
		Proveedor: data.Proveedor,
		Cantidad: parseFloat(data.Cantidad),
		Unidad: data.Unidad || 'kg',
		Estado: data.Estado || 'solicitado',
		IdProveedor: parseInt(data.IdProveedor),
		IdPedido: parseInt(data.IdPedido),
		RecepcionConforme: data.RecepcionConforme || null,
		FirmaRecepcion: data.FirmaRecepcion || null,
		IdMateriaPrimaBase: data.IdMateriaPrimaBase ? Number(data.IdMateriaPrimaBase) : null
	};

	return api.post("/materia-prima", materiaPrimaData).then(response => response.data);
}

export async function getAllMateriasPrimas() {
	return api.get("/materia-prima").then(response => response.data);
}

export async function updateMateriaPrima(id, data) {
	return api.put(`/materia-prima/${id}`, data).then(response => response.data);
}

export async function getMateriaPrimaById(id) {
	return api.get(`/materia-prima/${id}`).then(response => response.data);
}

// NUEVO: Obtener todas las materias primas base
export async function getAllMateriaPrimaBase() {
	return api.get("/materia-prima-base").then(response => response.data);
}

// NUEVO: Crear materia prima base
export async function createMateriaPrimaBase(data) {
	return api.post("/materia-prima-base", data).then(response => response.data);
}

// NUEVO: Actualizar materia prima base
export async function updateMateriaPrimaBase(id, data) {
	return api.put(`/materia-prima-base/${id}`, data).then(response => response.data);
}

// NUEVO: Obtener el log de movimientos de una materia prima base
export async function getLogMateriaPrimaBase(idMateriaPrimaBase) {
	return api.get(`/log-materia-prima/base/${idMateriaPrimaBase}`).then(response => response.data);
}
