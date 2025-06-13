import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCertificados } from "./services/certificados.service";

export default function Certificados() {
	const [lotes, setLotes] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const cargar = async () => {
			try {
				const data = await getAllCertificados();
				setLotes(data);
			} catch (error) {
				console.error("Error al cargar certificados:", error);
				alert("Error al cargar los certificados");
			}
		};
		cargar();
	}, []);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-6xl mx-auto">
				<header className="mb-8 text-center">
					<h1 className="text-3xl font-extrabold text-gray-800">
						📄 Certificados de Calidad
					</h1>
					<p className="text-gray-500 mt-2">
						Selecciona un lote certificado para ver su trazabilidad completa.
					</p>
				</header>

				{lotes.length === 0 ? (
					<p className="text-center text-gray-500">
						No hay lotes certificados.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{lotes.map((lote) => (
							<div
								key={lote.IdLote}
								className="bg-white rounded-xl shadow-md p-6 border cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border-green-200"
							>
								<h2 className="text-xl font-semibold text-gray-800 mb-1">
									Lote #{lote.IdLote}
								</h2>
								<p className="text-gray-600 text-sm mb-1">
									<strong>Nombre:</strong> {lote.Nombre}
								</p>
								<p className="text-gray-500 text-sm">
									<strong>Fecha de certificación:</strong>{" "}
									{new Date(lote.FechaCreacion).toLocaleDateString()}
								</p>
								<div className="mt-4 flex justify-between gap-2">
									<button
										onClick={() => navigate(`/certificado/${lote.IdLote}`)}
										className="bg-[#007c64] text-white text-sm px-4 py-2 rounded hover:bg-[#006554]"
									>
										📄 Certificado
									</button>
									<button
										onClick={() => navigate(`/certificado/${lote.IdLote}/qr`)}
										className="bg-[#5A6865] text-white text-sm px-4 py-2 rounded hover:bg-[#5A6865]"
									>
										📲 Generar QR
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
