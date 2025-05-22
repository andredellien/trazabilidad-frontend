import { useEffect, useState } from "react";
import { getAllLotes } from "../services/lotes.service";

export default function useLotes() {
	const [data, setData] = useState([]);
	const [loading, setLoad] = useState(true);
	const [error, setError] = useState(null);

	const fetchLotes = async () => {
		setLoad(true);
		try {
			const data = await getAllLotes();
			setData(data);
			setError(null);
		} catch (e) {
			setError(e.response?.data?.message || "Error");
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		fetchLotes();

		// Escuchamos el evento de creación de lote
		const handleLoteCreated = () => {
			fetchLotes();
		};

		window.addEventListener('lote-created', handleLoteCreated);

		// Limpiamos el listener cuando el componente se desmonta
		return () => {
			window.removeEventListener('lote-created', handleLoteCreated);
		};
	}, []);

	return { data, loading, error };
}
