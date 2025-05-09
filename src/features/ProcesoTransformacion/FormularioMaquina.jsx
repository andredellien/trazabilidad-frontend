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

	if (!maquina) return <p className="text-center mt-10">Cargando...</p>;

	return (
		<div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
				<h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
					{maquina.nombre}
				</h2>
				<img
					src={maquina.imagen}
					alt={maquina.nombre}
					className="w-full h-48 object-contain mb-6"
				/>

				<form onSubmit={handleSubmit} className="space-y-5">
					{Object.entries(maquina.variables).map(([nombre, rango]) => (
						<div key={nombre}>
							<label className="block font-medium text-gray-700 mb-1">
								{nombre} ({rango.min} – {rango.max})
							</label>
							<input
								type="number"
								step="any"
								required
								className={`w-full border p-2 rounded-md outline-none focus:ring-2 transition ${
									errores[nombre]
										? "border-red-500 focus:ring-red-300"
										: "border-gray-300 focus:ring-[#007c64]"
								}`}
								value={valores[nombre]}
								onChange={(e) =>
									handleChange(nombre, parseFloat(e.target.value))
								}
							/>
							{errores[nombre] && (
								<p className="text-sm text-red-600 mt-1">
									Valor fuera de rango permitido.
								</p>
							)}
						</div>
					))}

					<button
						type="submit"
						className="w-full bg-[#007c64] text-white py-2 px-4 rounded-md hover:bg-[#006554] transition"
					>
						Guardar y volver
					</button>
				</form>
			</div>
		</div>
	);
}

export default FormularioMaquina;
