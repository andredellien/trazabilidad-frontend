import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function FormularioMaquina() {
	const { idLote, numeroMaquina } = useParams();
	const [maquina, setMaquina] = useState(null);
	const [valores, setValores] = useState({});
	const [errores, setErrores] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const cargar = async () => {
			const res = await fetch("http://localhost:3000/api/maquinas");
			const data = await res.json();
			const maquinaSeleccionada = data[numeroMaquina];
			setMaquina(maquinaSeleccionada);

			// Inicializar valores vacíos
			const iniciales = {};
			for (let varName in maquinaSeleccionada.variables) {
				iniciales[varName] = "";
			}
			setValores(iniciales);
		};
		cargar();
	}, [numeroMaquina]);

	const handleChange = (nombre, valor) => {
		const nuevo = { ...valores, [nombre]: valor };
		setValores(nuevo);

		// Validar rango
		const regla = maquina.variables[nombre];
		const fueraDeRango =
			valor === "" ? false : valor < regla.min || valor > regla.max;
		setErrores({ ...errores, [nombre]: fueraDeRango });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const url = `http://localhost:3000/api/proceso-transformacion/${idLote}/maquina/${numeroMaquina}`;
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(valores),
		});
		const data = await res.json();
		if (res.ok) {
			alert("Formulario guardado con éxito");
			navigate(`/proceso/${idLote}`);
		} else {
			alert(data.message || "Error al guardar");
		}
	};

	if (!maquina) return <p>Cargando...</p>;

	return (
		<div className="p-4 max-w-xl mx-auto">
			<h2 className="text-2xl font-bold mb-4">{maquina.nombre}</h2>
			<img
				src={maquina.imagen}
				alt={maquina.nombre}
				className="rounded mb-4 w-full"
			/>

			<form onSubmit={handleSubmit} className="space-y-4">
				{Object.entries(maquina.variables).map(([nombre, rango]) => (
					<div key={nombre}>
						<label className="block font-semibold mb-1">
							{nombre} ({rango.min} – {rango.max})
						</label>
						<input
							type="number"
							step="any"
							required
							className={`w-full border p-2 rounded ${
								errores[nombre] ? "border-red-500" : "border-gray-300"
							}`}
							value={valores[nombre]}
							onChange={(e) => handleChange(nombre, parseFloat(e.target.value))}
						/>
						{errores[nombre] && (
							<p className="text-red-600 text-sm">Valor fuera de rango</p>
						)}
					</div>
				))}

				<button
					type="submit"
					className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Guardar
				</button>
			</form>
		</div>
	);
}

export default FormularioMaquina;
