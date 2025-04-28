import { useState } from "react";
import { createLote } from "../services/lotes.service";

export default function useCreateLote() {
	const [loading, setLoad] = useState(false);
	const [error, setError] = useState(null);
	const [success, setOk] = useState(false);

	async function handleCreate(form) {
		setLoad(true);
		setError(null);
		setOk(false);
		try {
			await createLote(form);
			setOk(true);
		} catch (e) {
			setError(e.response?.data?.message || "Error");
		} finally {
			setLoad(false);
		}
	}
	return { handleCreate, loading, error, success };
}
