export async function obtenerEstadoFormulario(idLote, numeroMaquina) {
	try {
		const res = await fetch(
			`http://localhost:3000/api/proceso-transformacion/${idLote}/maquina/${numeroMaquina}`
		);

		if (res.status === 404) {
			// ✅ Silenciar 404 como "no completado"
			return null;
		}

		if (!res.ok) {
			throw new Error(`Error HTTP ${res.status}`);
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error(
			`[❌] Error al obtener formulario de máquina ${numeroMaquina}:`,
			error.message
		);
		return null;
	}
}

export async function obtenerTodasMaquinas() {
	const res = await fetch(`http://localhost:3000/api/maquinas`);
	return await res.json();
}
