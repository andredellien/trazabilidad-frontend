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
			try {
				const res = await fetch(
					`http://localhost:3000/api/proceso-transformacion/lote/${idLote}`
				);
				const data = await res.json();
				const m = data.find((m) => m.Numero === parseInt(numeroMaquina));
				if (!m) {
					alert("Máquina no encontrada");
					return navigate(`/proceso/${idLote}`);
				}
				setMaquina(m);

				const iniciales = {};
				for (let v of m.Variables) {
					iniciales[v.Nombre] = "";
				}
				setValores(iniciales);
			} catch (error) {
				console.error("Error:", error);
				alert("Error al cargar los datos de la máquina");
			}
		};
		cargar();
	}, [idLote, numeroMaquina, navigate]);

	const handleChange = (nombre, valor) => {
		const nuevoValor = parseFloat(valor);
		const nuevaEntrada = { ...valores, [nombre]: nuevoValor };

		const regla = maquina.Variables.find((v) => v.Nombre === nombre);
		const fueraDeRango =
			isNaN(nuevoValor) ||
			nuevoValor < regla.ValorMin ||
			nuevoValor > regla.ValorMax;

		setValores(nuevaEntrada);
		setErrores({ ...errores, [nombre]: fueraDeRango });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(
			`http://localhost:3000/api/proceso-transformacion/${idLote}/maquina/${numeroMaquina}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(valores),
			}
		);
		const data = await res.json();
		if (res.ok) {
			alert(data.message + (data.cumple ? " ✅" : " ❌ No cumple estándares"));
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
					#{maquina.Numero} – {maquina.Nombre}
				</h2>
				<img
					src={maquina.Imagen}
					alt={maquina.Nombre}
					className="w-full h-48 object-contain mb-6 border rounded"
				/>

				<form onSubmit={handleSubmit} className="space-y-5">
					{maquina.Variables.map((v) => (
						<div key={v.Nombre}>
							<label className="block font-medium text-gray-700 mb-1">
								{v.Nombre} ({v.ValorMin} – {v.ValorMax})
							</label>
							<input
								type="number"
								step="any"
								required
								className={`w-full border p-2 rounded-md outline-none focus:ring-2 transition ${
									valores[v.Nombre] === ""
										? "border-gray-300 focus:ring-[#007c64]"
										: errores[v.Nombre]
										? "border-red-500 focus:ring-red-300"
										: "border-green-500 focus:ring-green-300"
								}`}
								value={valores[v.Nombre]}
								onChange={(e) => handleChange(v.Nombre, e.target.value)}
							/>
							{errores[v.Nombre] && (
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
