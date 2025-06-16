import api from "../../../shared/services/api";

export async function obtenerEstadoFormulario(idLote, numeroMaquina) {
	try {
		const res = await api.get(`/proceso-transformacion/${idLote}/maquina/${numeroMaquina}`);
		return res.data;
	} catch (error) {
		if (error.response?.status === 404) {
			// ✅ Silenciar 404 como "no completado"
			return null;
		}
		console.error(
			`[❌] Error al obtener formulario de máquina ${numeroMaquina}:`,
			error.message
		);
		return null;
	}
}

export async function obtenerTodasMaquinas() {
	const res = await api.get("/maquinas");
	return res.data;
}
