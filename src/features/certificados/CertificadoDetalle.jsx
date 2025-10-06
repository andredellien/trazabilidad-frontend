import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../../shared/services/api";
import BackButton from "../../shared/components/BackButton";

export default function CertificadoDetalle() {
	const { idLote } = useParams();
	const [lote, setLote] = useState(null);
	const [log, setLog] = useState(null);

	useEffect(() => {
		const cargar = async () => {
			try {
				const [loteRes, logRes] = await Promise.all([
					api.get(`/lote/${idLote}`),
					api.get(`/proceso-evaluacion/log/${idLote}`)
				]);
				
				setLote(loteRes.data);
				setLog(logRes.data);
			} catch (error) {
				console.error("Error al cargar el certificado:", error);
			}
		};
		cargar();
	}, [idLote]);

	if (!lote || !log)
		return <p className="text-center mt-10">Cargando certificado...</p>;

	const estado = log.ResultadoFinal.EstadoFinal;
	const motivo = log.ResultadoFinal.Motivo;
	const fecha = new Date(
		log.ResultadoFinal.FechaEvaluacion
	).toLocaleDateString();

	const descargarPDF = async () => {
		const elemento = document.getElementById("certificado-pdf");

		try {
			const canvas = await html2canvas(elemento, {
				scale: 2,
				useCORS: true,
				scrollX: 0,
				scrollY: 0,
				allowTaint: false,
			});

			const imgData = canvas.toDataURL("image/jpeg", 1.0);
			const pdf = new jsPDF("p", "mm", "a4");

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();

			const imgWidth = pageWidth;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			let position = 0;

			if (imgHeight < pageHeight) {
				pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
			} else {
				let heightLeft = imgHeight;
				while (heightLeft > 0) {
					pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
					heightLeft -= pageHeight;
					position -= pageHeight;
					if (heightLeft > 0) pdf.addPage();
				}
			}

			pdf.save(`certificado-lote-${idLote}.pdf`);
		} catch (err) {
			console.error("Error al generar PDF:", err);
			alert("Error al generar el certificado. Intenta nuevamente.");
		}
	};

	return (
		<div className="min-h-screen  py-10 px-6">
			<BackButton label="Volver a Certificados" to="/Certificados" />
			<div className="text-center mb-6">
				<button
					onClick={descargarPDF}
					className="bg-[#007c64] text-white px-6 py-2 rounded-md shadow hover:bg-[#006554] transition"
				>
					📥 Descargar en PDF
				</button>
			</div>
			<div
				id="certificado-pdf"
				className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 relative pdf-export-content"
			>
				{/* Encabezado institucional */}
				<header className="text-center border-b pb-4 mb-6">
					<h1 className="text-3xl font-bold text-gray-800 uppercase">
						Certificado de Calidad
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Sistema de Trazabilidad y Producción
					</p>
					<p className="text-xs text-gray-400">Fecha de evaluación: {fecha}</p>
				</header>

				{/* Información general */}
				<section className="mb-6">
					<h2 className="text-lg font-semibold text-[#007c64] mb-2">
						Información del Lote
					</h2>
					<div className="text-sm text-gray-700 space-y-1">
						<p>
							<strong>ID:</strong> {lote.IdLote}
						</p>
						<p>
							<strong>Nombre:</strong> {lote.Nombre}
						</p>
						<p>
							<strong>Fecha de creación:</strong>{" "}
							{new Date(lote.FechaCreacion).toLocaleDateString()}
						</p>
					</div>
				</section>

				{/* Materias primas */}
				<section className="mb-6">
					<h2 className="text-lg font-semibold text-[#007c64] mb-2">
						Materias Primas Utilizadas
					</h2>
					<ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
						{lote.MateriasPrimas.map((mp) => (
							<li key={mp.IdMateriaPrima}>
								{mp.Nombre} – {mp.Cantidad}
							</li>
						))}
					</ul>
				</section>

				{/* Proceso por máquinas */}
				<section className="mb-6">
					<h2 className="text-lg font-semibold text-[#007c64] mb-4">
						Proceso de Transformación
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{log.Maquinas.map((maq) => (
							<div
								key={maq.NumeroMaquina}
								className={`border-l-4 rounded-lg p-4 bg-gray-50 ${
									maq.CumpleEstandar ? "border-[#007c64]" : "border-red-500"
								}`}
							>
								<h3 className="font-semibold text-gray-800 mb-1">
									{maq.NumeroMaquina}. {maq.NombreMaquina}{" "}
									{maq.CumpleEstandar ? "Exito" : "Error"}
								</h3>
								<ul className="text-sm text-gray-600 space-y-1">
									{Object.entries(maq.VariablesIngresadas).map(([k, v]) => (
										<li key={k}>
											<strong>{k}</strong>: {v}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				{/* Resultado final */}
				<section className="text-center mt-10">
					<div className="inline-block px-6 py-2 rounded-full font-semibold text-white bg-[#007c64] shadow">
						✅ {estado}
					</div>
					<p className="mt-2 text-sm text-gray-600">{motivo}</p>
				</section>

				{/* Sello visual (simulado) */}
				<div className="absolute right-6 bottom-6 opacity-20 rotate-[-15deg]">
					<p className="text-5xl font-extrabold text-[#007c64]">CERTIFICADO</p>
				</div>
			</div>
		</div>
	);
}
