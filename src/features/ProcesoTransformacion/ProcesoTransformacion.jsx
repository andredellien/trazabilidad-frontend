import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaquinaCard from "./components/MaquinaCard";
import {
	obtenerTodasMaquinas,
	obtenerEstadoFormulario,
} from "./services/procesoService";

function ProcesoTransformacion() {
	const { idLote } = useParams();
	const [maquinas, setMaquinas] = useState([]);
	const [formularios, setFormularios] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const cargar = async () => {
			const datos = await obtenerTodasMaquinas();
			const completados = {};

			for (const [numero] of Object.entries(datos)) {
				const form = await obtenerEstadoFormulario(idLote, numero);
				completados[numero] = !!form;
			}
			setMaquinas(Object.values(datos));
			setFormularios(completados);
		};
		cargar();
	}, [idLote]);

	const handleClick = (numero) => {
		navigate(`/proceso/${idLote}/maquina/${numero}`);
	};

	const finalizarProceso = async () => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/proceso-evaluacion/finalizar/${idLote}`,
				{ method: "POST" }
			);
			const data = await res.json();
			alert(`Proceso finalizado: ${data.message}\nMotivo: ${data.motivo}`);
			navigate(`/proceso/${idLote}/resumen`);
		} catch (error) {
			console.error("Error al finalizar el proceso:", error);
			alert("Ocurrió un error al finalizar el proceso.");
		}
	};

	const procesoListo =
		Object.keys(formularios).length === 12 &&
		Object.values(formularios).every((f) => f === true);

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">
				Proceso de Transformación – Lote #{idLote}
			</h2>
			<div className="flex flex-wrap justify-center">
				{maquinas.map((maquina, index) => {
					const completada = formularios[maquina.numero];
					const bloqueada =
						index > 0 && !formularios[maquinas[index - 1].numero];

					return (
						<MaquinaCard
							key={maquina.numero}
							maquina={maquina}
							completada={completada}
							bloqueada={bloqueada}
							onClick={() => handleClick(maquina.numero)}
						/>
					);
				})}
			</div>

			{procesoListo && (
				<div className="mt-6 text-center">
					<button
						onClick={finalizarProceso}
						className="bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700 transition"
					>
						✅ Finalizar Proceso
					</button>
				</div>
			)}
		</div>
	);
}

export default ProcesoTransformacion;
