import React from "react";

export default function CertificadoPDF({ lote, log }) {
	const fecha = new Date(
		log.ResultadoFinal.FechaEvaluacion
	).toLocaleDateString();
	const estado = log.ResultadoFinal.EstadoFinal;
	const motivo = log.ResultadoFinal.Motivo;

	return (
		<div id="certificado-a4" style={estilos.base}>
			<h1 style={estilos.titulo}>CERTIFICADO DE CALIDAD</h1>
			<p style={estilos.subtitulo}>Sistema de Trazabilidad y Producción</p>
			<p style={estilos.fecha}>Fecha de Evaluación: {fecha}</p>

			<section style={estilos.seccion}>
				<h2 style={estilos.h2}>Información del Lote</h2>
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
			</section>

			<section style={estilos.seccion}>
				<h2 style={estilos.h2}>Materias Primas</h2>
				<ul>
					{lote.MateriasPrimas.map((mp) => (
						<li key={mp.IdMateriaPrima}>
							{mp.Nombre} – {mp.Cantidad}
						</li>
					))}
				</ul>
			</section>

			<section style={estilos.seccion}>
				<h2 style={estilos.h2}>Proceso de Transformación</h2>
				{log.Maquinas.map((m) => (
					<div key={m.NumeroMaquina} style={estilos.card}>
						<strong>
							{m.NumeroMaquina}. {m.NombreMaquina}
						</strong>{" "}
						{m.CumpleEstandar ? "Exito" : "Error"}
						<ul>
							{Object.entries(m.VariablesIngresadas).map(([k, v]) => (
								<li key={k}>
									<em>{k}</em>: {v}
								</li>
							))}
						</ul>
					</div>
				))}
			</section>

			<section style={estilos.resultado}>
				<h2 style={estilos.h2}>Resultado Final</h2>
				<p style={estado === "Certificado" ? estilos.ok : estilos.fail}>
					{estado === "Certificado" ? "Exito" : "Error"} {estado}
				</p>
				<p style={estilos.motivo}>{motivo}</p>
			</section>

			<footer style={estilos.footer}>
				<p>Emitido por el Sistema de Producción - {new Date().getFullYear()}</p>
			</footer>
		</div>
	);
}

const estilos = {
	base: {
		fontFamily: "'Segoe UI', sans-serif",
		width: "794px", // A4 width at 96 DPI
		minHeight: "1120px", // A4 height at 96 DPI
		padding: "40px",
		boxSizing: "border-box",
		backgroundColor: "#fff",
		color: "#333",
		margin: "auto",
	},
	titulo: {
		textAlign: "center",
		fontSize: "28px",
		fontWeight: "bold",
		marginBottom: "5px",
	},
	subtitulo: {
		textAlign: "center",
		fontSize: "14px",
		color: "#777",
		marginBottom: "10px",
	},
	fecha: {
		textAlign: "center",
		fontSize: "12px",
		color: "#aaa",
		marginBottom: "20px",
	},
	seccion: {
		marginBottom: "25px",
	},
	h2: {
		fontSize: "16px",
		fontWeight: "bold",
		marginBottom: "5px",
		color: "#007c64",
	},
	card: {
		border: "1px solid #ddd",
		borderRadius: "4px",
		padding: "8px",
		marginBottom: "10px",
		backgroundColor: "#f9f9f9",
	},
	ok: {
		color: "#007c64",
		fontWeight: "bold",
		fontSize: "16px",
	},
	fail: {
		color: "#d93025",
		fontWeight: "bold",
		fontSize: "16px",
	},
	motivo: {
		fontSize: "13px",
		marginTop: "4px",
	},
	resultado: {
		borderTop: "1px solid #ccc",
		paddingTop: "10px",
		textAlign: "center",
	},
	footer: {
		position: "absolute",
		bottom: "30px",
		width: "100%",
		textAlign: "center",
		fontSize: "10px",
		color: "#aaa",
	},
};
