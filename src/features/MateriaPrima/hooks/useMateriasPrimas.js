import { useEffect, useState } from "react";
import { getAllMateriasPrimas } from "../services/materiaPrima.service";

export default function useMateriasPrimas() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getAllMateriasPrimas()
			.then(setData)
			.catch((err) =>
				setError(err.response?.data?.message || "Error de conexión")
			)
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error };
}
