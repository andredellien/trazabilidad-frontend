import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function CrearProceso() {
	const [searchParams] = useSearchParams();
	const baseId = searchParams.get("base");
	const [nombreProceso, setNombreProceso] = useState("");
	const [maquinasDisponibles, setMaquinasDisponibles] = useState([]);
	const [maquinasSeleccionadas, setMaquinasSeleccionadas] = useState([]);
	const navigate = useNavigate();

	// ✅ Cargar máquinas disponibles
	useEffect(() => {
		const cargarMaquinas = async () => {
			const res = await fetch("http://localhost:3000/api/maquinas");
			const data = await res.json();
			setMaquinasDisponibles(data);
		};
		cargarMaquinas();
	}, []);

	// ✅ Si viene desde duplicar, precargar proceso base
	useEffect(() => {
		const cargarBase = async () => {
			if (!baseId) return;

			try {
				const res = await fetch(`http://localhost:3000/api/procesos/${baseId}`);
				const data = await res.json();

				setNombreProceso(data.Nombre + " (Copia)");

				const maquinasProcesadas = data.Maquinas.map((m, i) => ({
					IdMaquina: m.IdMaquina,
					Nombre: m.Nombre,
					ImagenUrl: m.Imagen,
					numero: i + 1,
					variables: m.variables.map((v) => ({
						nombre: v.Nombre,
						min: v.ValorMin,
						max: v.ValorMax,
					})),
				}));

				setMaquinasSeleccionadas(maquinasProcesadas);
			} catch (error) {
				console.error("Error al duplicar proceso:", error);
				alert("No se pudo duplicar el proceso");
			}
		};

		cargarBase();
	}, [baseId]);

	const agregarMaquina = (m) => {
		if (maquinasSeleccionadas.find((x) => x.IdMaquina === m.IdMaquina)) return;
		setMaquinasSeleccionadas([
			...maquinasSeleccionadas,
			{ ...m, numero: maquinasSeleccionadas.length + 1, variables: [] },
		]);
	};

	const eliminarMaquina = (index) => {
		const nuevas = maquinasSeleccionadas.filter((_, i) => i !== index);
		// Reordenar los números de las máquinas restantes
		const reordenadas = nuevas.map((m, i) => ({
			...m,
			numero: i + 1
		}));
		setMaquinasSeleccionadas(reordenadas);
	};

	const actualizarVariable = (iMaquina, iVar, campo, valor) => {
		const nuevas = [...maquinasSeleccionadas];
		nuevas[iMaquina].variables[iVar][campo] = valor;
		setMaquinasSeleccionadas(nuevas);
	};

	const agregarVariable = (iMaquina) => {
		const nuevas = [...maquinasSeleccionadas];
		nuevas[iMaquina].variables.push({ nombre: "", min: 0, max: 0 });
		setMaquinasSeleccionadas(nuevas);
	};

	const validarProceso = () => {
		if (!nombreProceso.trim()) {
			alert("⚠️ Debes ingresar un nombre para el proceso");
			return false;
		}

		for (const [i, maquina] of maquinasSeleccionadas.entries()) {
			if (!maquina.variables || maquina.variables.length === 0) {
				alert(
					`⚠️ La máquina #${i + 1} (${
						maquina.Nombre || maquina.nombre
					}) no tiene variables`
				);
				return false;
			}

			for (const [j, variable] of maquina.variables.entries()) {
				if (!variable.nombre || variable.nombre.trim() === "") {
					alert(
						`⚠️ La variable #${j + 1} de la máquina ${
							maquina.Nombre || maquina.nombre
						} no tiene nombre`
					);
					return false;
				}

				if (
					variable.min === "" ||
					variable.max === "" ||
					variable.min === null ||
					variable.max === null ||
					isNaN(variable.min) ||
					isNaN(variable.max)
				) {
					alert(
						`⚠️ La variable "${variable.nombre}" debe tener valores numéricos en ambos campos`
					);
					return false;
				}

				if (parseFloat(variable.min) > parseFloat(variable.max)) {
					alert(
						`⚠️ En la variable "${variable.nombre}", el mínimo no puede ser mayor que el máximo`
					);
					return false;
				}
			}
		}

		return true;
	};

	const guardarProceso = async () => {
		if (!validarProceso()) return;
		const payload = {
			nombre: nombreProceso,
			maquinas: maquinasSeleccionadas.map((m, i) => ({
				idMaquina: m.IdMaquina,
				numero: i + 1,
				nombre: m.Nombre,
				imagen: m.ImagenUrl,
				variables: m.variables,
			})),
		};

		const res = await fetch("http://localhost:3000/api/procesos", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data = await res.json();
		if (res.ok) {
			alert("Proceso creado ✅");
			setNombreProceso("");
			setMaquinasSeleccionadas([]);
			navigate("/procesos");
		} else {
			alert("❌ " + data.message);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-8">
			<h2 className="text-2xl font-bold text-[#007c64] mb-6">
				Crear nuevo proceso
			</h2>

			<div className="mb-6">
				<label className="block text-gray-700 font-medium mb-1">
					Nombre del proceso
				</label>
				<input
					type="text"
					value={nombreProceso}
					onChange={(e) => setNombreProceso(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			{/* Máquinas disponibles */}
			<h3 className="text-lg font-semibold text-gray-700 mb-2">
				Selecciona máquinas
			</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
				{maquinasDisponibles.map((m) => (
					<button
						key={m.IdMaquina}
						onClick={() => agregarMaquina(m)}
						className="border rounded p-3 hover:shadow transition bg-gray-50"
					>
						<img
							src={m.ImagenUrl}
							alt={m.Nombre}
							className="w-full h-32 object-contain rounded mb-2"
						/>
						<p className="text-center text-sm font-medium">{m.Nombre}</p>
					</button>
				))}
			</div>

			{/* Máquinas seleccionadas */}
			{maquinasSeleccionadas.map((m, i) => (
				<div key={m.IdMaquina} className="mb-6 border-t pt-4">
					<div className="flex items-center justify-between gap-4 mb-2">
						<div className="flex items-center gap-4">
							<img
								src={m.ImagenUrl}
								alt={m.Nombre}
								className="w-24 h-24 object-contain border rounded"
							/>
							<div>
								<h4 className="font-semibold text-gray-800">
									#{i + 1} – {m.Nombre}
								</h4>
								<p className="text-sm text-gray-400">ID: {m.IdMaquina}</p>
							</div>
						</div>
						<button
							onClick={() => eliminarMaquina(i)}
							className="text-red-600 hover:text-red-800 p-4 bg-gray-100 hover:bg-gray-200 "
							title="Eliminar máquina"
						>
							🗑️ 
						</button>
					</div>

					<h5 className="text-sm font-medium text-gray-600 mb-1">
						Variables estándar:
					</h5>
					{m.variables.map((v, j) => (
						<div key={j} className="grid grid-cols-3 gap-2 mb-2">
							<input
								type="text"
								placeholder="Nombre"
								className="border p-1 rounded"
								value={v.nombre}
								onChange={(e) =>
									actualizarVariable(i, j, "nombre", e.target.value)
								}
							/>
							<input
								type="number"
								placeholder="Min"
								className="border p-1 rounded"
								value={v.min}
								onChange={(e) =>
									actualizarVariable(i, j, "min", parseFloat(e.target.value))
								}
							/>
							<input
								type="number"
								placeholder="Max"
								className="border p-1 rounded"
								value={v.max}
								onChange={(e) =>
									actualizarVariable(i, j, "max", parseFloat(e.target.value))
								}
							/>
						</div>
					))}

					<button
						onClick={() => agregarVariable(i)}
						className="text-sm text-blue-600 hover:underline"
					>
						➕ Agregar variable
					</button>
				</div>
			))}

			<div className="text-right mt-8">
				<button
					onClick={guardarProceso}
					className="bg-[#007c64] text-white px-6 py-2 rounded hover:bg-[#006554]"
				>
					💾 Guardar proceso
				</button>
			</div>
		</div>
	);
}
