import { useEffect, useState } from "react";
import { getAllMateriasPrimas } from "../services/materiaPrima.service";

export default function useMateriasPrimas() {
	const [data, setData] = useState([]);
	const [loading, setLoad] = useState(true);
	const [error, setError] = useState(null);

	const fetchMaterias = async () => {
		setLoad(true);
		try {
			const datos = await getAllMateriasPrimas();
			setData(datos);
			setError(null);
		} catch (err) {
			console.error(err);
			setError("Error al obtener las materias primas");
		} finally {
			setLoad(false);
		}
	};

	useEffect(() => {
		fetchMaterias();

		// Escuchamos el evento de creación de materia prima
		const handleMateriaPrimaCreated = () => {
			fetchMaterias();
		};

		window.addEventListener('materia-prima-created', handleMateriaPrimaCreated);

		// Limpiamos el listener cuando el componente se desmonta
		return () => {
			window.removeEventListener('materia-prima-created', handleMateriaPrimaCreated);
		};
	}, []);

	return { data, loading, error };
}
