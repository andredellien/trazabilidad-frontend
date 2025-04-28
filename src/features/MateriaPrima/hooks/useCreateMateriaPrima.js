import { useState } from "react";
import { createMateriaPrima } from "../services/materiaPrima.service";

export default function useCreateMateriaPrima() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	async function handleCreate(formValues) {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			await createMateriaPrima(formValues);
			setSuccess(true);
		} catch (err) {
			setError(err.response?.data?.message || "Error de red");
		} finally {
			setLoading(false);
		}
	}

	return { handleCreate, loading, error, success };
}
