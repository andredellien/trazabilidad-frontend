import { useEffect, useState } from "react";
import { getAllLotes } from "../services/lotes.service";

export default function useLotes() {
	const [data, setData] = useState([]);
	const [loading, setLoad] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getAllLotes()
			.then(setData)
			.catch((e) => setError(e.response?.data?.message || "Error"))
			.finally(() => setLoad(false));
	}, []);

	return { data, loading, error };
}
