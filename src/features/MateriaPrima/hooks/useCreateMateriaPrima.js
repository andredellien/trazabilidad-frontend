import { useState } from "react";
import { createMateriaPrima } from "../services/materiaPrima.service";

export default function useCreateMateriaPrima() {
	const [loading, setLoad] = useState(false);
	const [error, setError] = useState(null);
	const [success, setOk] = useState(false);

	async function handleCreate(form) {
		setLoad(true);
		setError(null);
		setOk(false);
		try {
			await createMateriaPrima(form);
			setOk(true);
			// Disparamos un evento personalizado que MateriaPrimaList puede escuchar
			window.dispatchEvent(new CustomEvent('materia-prima-created'));
		} catch (e) {
			setError(e.response?.data?.message || "Error");
		} finally {
			setLoad(false);
		}
	}
	return { handleCreate, loading, error, success };
}
