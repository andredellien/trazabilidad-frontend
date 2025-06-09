import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListaProcesos() {
	const [procesos, setProcesos] = useState([]);
	const [detalles, setDetalles] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const cargar = async () => {
			const res = await fetch("http://localhost:3000/api/procesos");
			const data = await res.json();
			// Sort processes in reverse order by ID
			const sortedData = data.sort((a, b) => b.IdProceso - a.IdProceso);
			setProcesos(sortedData);
		};
		cargar();
	}, []);

	const toggleDetalle = async (id) => {
		if (detalles[id]) {
			const nuevos = { ...detalles };
			delete nuevos[id];
			setDetalles(nuevos);
		} else {
			const res = await fetch(`http://localhost:3000/api/procesos/${id}`);
			const data = await res.json();
			setDetalles({ ...detalles, [id]: data });
		}
	};

	const eliminarProceso = async (id) => {
		const confirmar = confirm(
			"¿Estás seguro que deseas eliminar este proceso?"
		);
		if (!confirmar) return;

		try {
			const res = await fetch(`http://localhost:3000/api/procesos/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (res.ok) {
				alert("Proceso eliminado ✅");
				setProcesos((prev) => prev.filter((p) => p.IdProceso !== id));
			} else {
				alert("❌ " + data.message);
			}
		} catch (err) {
			console.error("Error al eliminar:", err);
			alert("Error al eliminar el proceso");
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white shadow rounded mt-8">
			<div className="flex justify-between items-center mb-8">
				<h2 className="text-3xl font-extrabold text-[#007c64]">
					📂 Procesos de Transformación
				</h2>
				<button
					onClick={() => navigate("/procesos/crear")}
					className="bg-[#007c64] text-white px-5 py-2 rounded hover:bg-[#006554] transition"
				>
					➕ Crear proceso
				</button>
			</div>

			{procesos.length === 0 ? (
				<p className="text-gray-500 text-center">
					No hay procesos registrados.
				</p>
			) : (
				<div className="space-y-6">
					{procesos.map((p) => (
						<div
							key={p.IdProceso}
							className="border rounded-lg shadow-sm bg-gray-50 hover:shadow transition"
						>
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4">
								<div>
									<h3 className="text-xl font-semibold text-gray-800">
										{p.Nombre}
									</h3>
									<p className="text-sm text-gray-500">ID: {p.IdProceso}</p>
								</div>
								<div className="flex flex-wrap gap-3">
									<button
										onClick={() => toggleDetalle(p.IdProceso)}
										className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
									>
										{detalles[p.IdProceso] ? "Ocultar detalle" : "Ver detalle"}
									</button>
									<button
										onClick={() => navigate(`/procesos/${p.IdProceso}/editar`)}
										className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
									>
										✏️ Editar
									</button>
									<button
										onClick={() =>
											navigate(`/procesos/crear?base=${p.IdProceso}`)
										}
										className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
									>
										📋 Duplicar
									</button>
									<button
										onClick={() => navigate(`/procesos/${p.IdProceso}/pdf`)}
										className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
									>
										📄 Ver PDF
									</button>
									<button
										onClick={() => eliminarProceso(p.IdProceso)}
										className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
									>
										🗑 Eliminar
									</button>
								</div>
							</div>

							{/* Detalle expandido */}
							{detalles[p.IdProceso] && (
								<div className="p-4 pt-0 pb-5">
									<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
										{detalles[p.IdProceso].Maquinas.map((m) => (
											<div
												key={m.IdMaquina}
												className="bg-white rounded border p-3"
											>
												<img
													src={m.Imagen}
													alt={m.Nombre}
													className="w-full h-32 object-contain mb-3 rounded border"
												/>
												<h4 className="font-medium text-gray-700">
													#{m.Numero} – {m.Nombre}
												</h4>
												<ul className="text-sm text-gray-600 mt-1 list-disc ml-5">
													{m.variables.map((v, i) => (
														<li key={i}>
															{v.Nombre}{" "}
															<span className="text-gray-500">
																({v.ValorMin} – {v.ValorMax})
															</span>
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
