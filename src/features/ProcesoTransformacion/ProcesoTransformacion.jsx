import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaquinaCard from "./components/MaquinaCard";
import { obtenerEstadoFormulario } from "./services/procesoService";
import api from "../../shared/services/api";

export function ProcesoTransformacion() {
	const { idLote } = useParams();
	const navigate = useNavigate();

	const [lote, setLote] = useState(null);
	const [procesos, setProcesos] = useState([]);
	const [maquinas, setMaquinas] = useState([]);
	const [formularios, setFormularios] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// ✅ Cargar lote y procesos
	useEffect(() => {
		const cargar = async () => {
			try {
				setLoading(true);
				const loteRes = await api.get(`/lote/${idLote}`);
				const loteData = loteRes.data;
				setLote(loteData);

				if (!loteData.IdProceso) {
					const resProcesos = await api.get("/procesos");
					setProcesos(resProcesos.data || []);
				}
			} catch (error) {
				console.error("Error al cargar datos:", error);
				setError("Error al cargar los datos del lote");
			} finally {
				setLoading(false);
			}
		};
		cargar();
	}, [idLote]);

	// ✅ Cargar máquinas cuando el proceso está definido
	useEffect(() => {
		const cargarMaquinas = async () => {
			if (!lote?.IdProceso) return;
			try {
				const res = await api.get(`/proceso-transformacion/lote/${idLote}`);
				const data = res.data;

				const completados = {};
				for (const maquina of data) {
					const form = await obtenerEstadoFormulario(idLote, maquina.Numero);
					completados[maquina.Numero] = !!form;
				}

				setMaquinas(data);
				setFormularios(completados);
			} catch (error) {
				console.error("Error al cargar máquinas:", error);
				alert("Error al cargar las máquinas del proceso");
			}
		};
		cargarMaquinas();
	}, [lote, idLote]);

	// ✅ Asignar proceso al lote
	const asignarProceso = async (e) => {
		const idProceso = parseInt(e.target.value);
		if (!idProceso) return;

		try {
			const res = await api.put(`/lote/${idLote}`, {
				...lote,
				IdProceso: idProceso,
			});

			if (res.status === 200) {
				setLote({ ...lote, IdProceso: idProceso });
			}
		} catch (error) {
			console.error("Error al asignar proceso:", error);
			alert("Error al asignar proceso");
		}
	};

	const handleClick = (numero) => {
		navigate(`/proceso/${idLote}/maquina/${numero}`);
	};

	const totalCompletados = Object.values(formularios).filter(Boolean).length;
	const procesoListo = totalCompletados === maquinas.length;

	const finalizarProceso = async () => {
		try {
			const res = await api.post(`/proceso-evaluacion/finalizar/${idLote}`);
			const data = res.data;
			alert(`Proceso finalizado: ${data.message}\nMotivo: ${data.motivo}`);
			navigate(`/certificado/${idLote}`);
		} catch (error) {
			console.error("Error al finalizar proceso:", error);
			alert("Error al finalizar el proceso.");
		}
	};

	if (loading) return <p className="p-4">Cargando...</p>;
	if (error) return <p className="p-4 text-red-600">{error}</p>;
	if (!lote) return <p className="p-4">No se encontró el lote</p>;

	return (
		<div className="min-h-screen py-10 px-4">
			<div className="max-w-6xl mx-auto">
				<header className="text-center mb-10">
					<h2 className="text-3xl font-extrabold text-gray-800 mb-2">
						Proceso de Transformación – Lote #{idLote}
					</h2>

					{/* Mostrar selector si no hay proceso asignado */}
					{!lote.IdProceso ? (
						<div className="mt-4 max-w-sm mx-auto">
							<label className="block mb-1 text-gray-700 font-medium">
								Selecciona un proceso
							</label>
							<select
								className="w-full border p-2 rounded"
								onChange={asignarProceso}
								defaultValue=""
							>
								<option value="" disabled>
									-- Escoge un proceso --
								</option>
								{Array.isArray(procesos) && procesos.map((p) => (
									<option key={p.IdProceso} value={p.IdProceso}>
										{p.Nombre}
									</option>
								))}
							</select>
						</div>
					) : (
						<>
							<p className="text-gray-500 mt-2">
								Completa cada paso del proceso en orden para certificar el lote.
							</p>
							<div className="mt-4">
								<span className="text-sm text-gray-600">
									Progreso: {totalCompletados} / {maquinas.length} máquinas
									completadas
								</span>
								<div className="h-2 mt-1 bg-gray-200 rounded">
									<div
										className="h-full bg-[#007c64] rounded transition-all duration-300"
										style={{
											width: `${(totalCompletados / maquinas.length) * 100}%`,
										}}
									></div>
								</div>
							</div>
						</>
					)}
				</header>

				{/* Mostrar tarjetas si hay proceso asignado */}
				{lote.IdProceso && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							{maquinas.map((maquina, index) => {
								const completada = formularios[maquina.Numero];
								const bloqueada =
									index > 0 && !formularios[maquinas[index - 1].Numero];

								return (
									<MaquinaCard
										key={maquina.Numero}
										maquina={{
											nombre: maquina.Nombre,
											imagen: maquina.Imagen,
											numero: maquina.Numero,
										}}
										completada={completada}
										bloqueada={bloqueada}
										onClick={() => handleClick(maquina.Numero)}
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
					</>
				)}
			</div>
		</div>
	);
}

export default ProcesoTransformacion;
