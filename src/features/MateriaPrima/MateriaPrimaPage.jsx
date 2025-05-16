import { useEffect, useState } from "react";
import MateriaPrimaForm from "./Components/MateriaPrimaForm";
import MateriaPrimaList from "./Components/MateriaPrimaList";
import { getAllMateriasPrimas } from "./services/materiaPrima.service";

export default function MateriaPrimaPage() {
	const [materias, setMaterias] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchMaterias = async () => {
		setLoading(true);
		try {
			const datos = await getAllMateriasPrimas();
			setMaterias(datos);
			setError(null);
		} catch (err) {
			console.error(err);
			setError("Error al obtener las materias primas");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMaterias();
	}, []);

	return (
		<>
			<MateriaPrimaForm onCreated={fetchMaterias} />
			<MateriaPrimaList materias={materias} loading={loading} error={error} />
		</>
	);
}
