import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BackButton from "../../shared/components/BackButton";
import { getProcesoById } from "./services/proceso.service";
import Modal from "../../shared/components/Modal";

export default function ProcesoPDF() {
	const { id } = useParams();
	const [proceso, setProceso] = useState(null);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
	const pdfRef = useRef();

	useEffect(() => {
		const cargarProceso = async () => {
			const data = await getProcesoById(id);
			setProceso(data);
		};
		cargarProceso();
	}, [id]);

	const descargarPDF = async () => {
		try {
			const element = pdfRef.current;
			const canvas = await html2canvas(element, {
				scale: 2,
				backgroundColor: "#ffffff",
				useCORS: true,
			});

			const imgData = canvas.toDataURL("image/png");
			const pdf = new jsPDF("p", "mm", "a4");
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const ratio = Math.min(
				pageWidth / canvas.width,
				pageHeight / canvas.height
			);
			const imgWidth = canvas.width * ratio;
			const imgHeight = canvas.height * ratio;
			const x = (pageWidth - imgWidth) / 2;
			const y = 10;

			pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
			pdf.save(`Proceso_${id}.pdf`);
		} catch (error) {
			console.error("❌ Error al generar PDF:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al generar el certificado. Intenta nuevamente.",
				type: "error"
			});
		}
	};

	if (!proceso) return <p style={{ padding: "1rem" }}>Cargando proceso...</p>;

	return (
		<div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
			/>
			<BackButton label="Volver a Procesos" to="/procesos" />

			<div style={{ textAlign: "right", marginBottom: "1rem" }}>
				<button
					onClick={descargarPDF}
					style={{
						backgroundColor: "#007c64",
						color: "#fff",
						border: "none",
						padding: "10px 16px",
						borderRadius: "5px",
						cursor: "pointer",
					}}
				>
					📄 Descargar PDF
				</button>
			</div>

			{/* CONTENIDO PARA EXPORTAR */}
			<div
				ref={pdfRef}
				style={{
					backgroundColor: "#ffffff",
					color: "#000000",
					padding: "2rem",
					fontFamily: "Arial, sans-serif",
					borderRadius: "8px",
					boxShadow: "0 0 10px rgba(0,0,0,0.1)",
				}}
			>
				<h1 style={{ textAlign: "center", fontSize: "28px", color: "#007c64" }}>
					Certificado de Proceso
				</h1>
				<p style={{ textAlign: "center", marginBottom: "2rem", color: "#444" }}>
					<strong>ID:</strong> {proceso.IdProceso} — <strong>Nombre:</strong>{" "}
					{proceso.Nombre}
				</p>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
						gap: "1rem",
					}}
				>
					{proceso.Maquinas.map((m) => (
						<div
							key={m.IdMaquina}
							style={{
								border: "1px solid #ddd",
								padding: "1rem",
								borderRadius: "6px",
								backgroundColor: "#fafafa",
							}}
						>
							<div
								style={{
									width: "100%",
									aspectRatio: "4 / 3",
									backgroundColor: "#fff",
									border: "1px solid #ccc",
									borderRadius: "4px",
									marginBottom: "0.5rem",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<img
									src={m.Imagen}
									alt={m.Nombre}
									style={{
										maxWidth: "100%",
										maxHeight: "100%",
										objectFit: "contain",
									}}
								/>
							</div>
							<h3
								style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}
							>
								#{m.Numero} – {m.Nombre}
							</h3>
							<ul
								style={{ fontSize: "14px", color: "#555", paddingLeft: "1rem" }}
							>
								{m.variables.map((v, i) => (
									<li key={i}>
										{v.nombre}: {v.min} – {v.max}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
