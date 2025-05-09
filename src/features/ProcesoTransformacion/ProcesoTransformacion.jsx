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

	const totalCompletados = Object.values(formularios).filter(Boolean).length;
	const procesoListo = totalCompletados === 12;

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
			alert("Error al finalizar el proceso.");
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen  py-10 px-4">
			<div className="max-w-6xl mx-auto">
				<header className="text-center mb-10">
					<h2 className="text-3xl font-extrabold text-gray-800">
						Proceso de Transformación – Lote #{idLote}
					</h2>
					<p className="text-gray-500 mt-2">
						Completa cada paso del proceso en orden para poder certificar el
						lote.
					</p>
					<div className="mt-4">
						<span className="text-sm text-gray-600">
							Progreso: {totalCompletados} / 12 máquinas completadas
						</span>
						<div className="h-2 mt-1 bg-gray-200 rounded">
							<div
								className="h-full bg-[#007c64] rounded transition-all duration-300"
								style={{ width: `${(totalCompletados / 12) * 100}%` }}
							></div>
						</div>
					</div>
				</header>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
					<div className="text-center mt-10">
						<button
							onClick={finalizarProceso}
							className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
						>
							✅ Finalizar Proceso
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default ProcesoTransformacion;
