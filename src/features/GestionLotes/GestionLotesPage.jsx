import { useEffect, useState } from "react";
import LoteForm from "./components/LoteForm";
import LoteList from "./components/LoteList";
import { getAllLotes } from "./services/lotes.service";

export default function LotePage() {
	const [lotes, setLotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchLotes = async () => {
		setLoading(true);
		try {
			const data = await getAllLotes();
			setLotes(data);
			setError(null);
		} catch (e) {
			setError("Error al obtener los lotes");
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLotes();
	}, []);

	return (
		<>
			<LoteForm onCreated={fetchLotes} />

			<LoteList lotes={lotes} loading={loading} error={error} />
		</>
	);
}
