import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SeleccionarLote() {
	const [lotes, setLotes] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const cargarLotes = async () => {
			const res = await fetch("http://localhost:3000/api/lote");
			const data = await res.json();
			const pendientes = data.filter((lote) => lote.Estado === "Pendiente");
			setLotes(pendientes);
		};
		cargarLotes();
	}, []);

	const seleccionar = (id) => {
		navigate(`/proceso/${id}`);
	};

	return (
		<div className="min-h-screen  p-6">
			<div className="max-w-6xl mx-auto">
				<header className="mb-8 text-center">
					<h1 className="text-3xl font-extrabold text-gray-800">
						🚚 Gestión de Lotes Pendientes
					</h1>
					<p className="text-gray-500 mt-2">
						Selecciona un lote para iniciar su proceso de transformación.
					</p>
				</header>

				{lotes.length === 0 ? (
					<p className="text-center text-gray-500">No hay lotes pendientes.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{lotes.map((lote) => (
							<div
								key={lote.IdLote}
								className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200"
								onClick={() => seleccionar(lote.IdLote)}
							>
								<h2 className="text-xl font-semibold text-gray-800 mb-1">
									Lote #{lote.IdLote}
								</h2>
								<p className="text-gray-600 text-sm mb-1">
									<strong>Nombre:</strong> {lote.Nombre}
								</p>
								<p className="text-gray-500 text-sm">
									<strong>Fecha de creación:</strong>{" "}
									{new Date(lote.FechaCreacion).toLocaleDateString()}
								</p>
								<div className="mt-4 text-right">
									<span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
										Pendiente
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default SeleccionarLote;
