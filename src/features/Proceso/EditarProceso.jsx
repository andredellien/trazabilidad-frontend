import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarProceso() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [nombreProceso, setNombreProceso] = useState("");
	const [maquinas, setMaquinas] = useState([]);

	useEffect(() => {
		const cargarProceso = async () => {
			try {
				const res = await fetch(`http://localhost:3000/api/procesos/${id}`);
				const data = await res.json();

				const maquinasProcesadas = data.Maquinas.map((m, i) => ({
					...m,
					numero: i + 1,
					variables: Array.isArray(m.variables)
						? m.variables.map((v) => ({
								nombre: v.Nombre,
								min: v.ValorMin,
								max: v.ValorMax,
						  }))
						: [],
				}));

				setNombreProceso(data.Nombre);
				setMaquinas(maquinasProcesadas);
			} catch (error) {
				console.error("Error al cargar proceso:", error);
				alert("No se pudo cargar el proceso");
			}
		};

		cargarProceso();
	}, [id]);

	const actualizarVariable = (iMaquina, iVar, campo, valor) => {
		const nuevas = [...maquinas];
		nuevas[iMaquina].variables[iVar][campo] = valor;
		setMaquinas(nuevas);
	};

	const agregarVariable = (iMaquina) => {
		const nuevas = [...maquinas];
		nuevas[iMaquina].variables.push({ nombre: "", min: 0, max: 0 });
		setMaquinas(nuevas);
	};

	const validarProceso = () => {
		if (!nombreProceso.trim()) {
			alert("⚠️ Debes ingresar un nombre para el proceso");
			return false;
		}

		for (const [i, maquina] of maquinas.entries()) {
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

	const guardarCambios = async () => {
		if (!validarProceso()) return;
		const payload = {
			nombre: nombreProceso,
			maquinas: maquinas.map((m, i) => ({
				idMaquina: m.IdMaquina,
				numero: i + 1,
				nombre: m.Nombre,
				imagen: m.Imagen,
				variables: m.variables.map((v) => ({
					nombre: v.nombre,
					min: v.min,
					max: v.max,
				})),
			})),
		};

		try {
			const res = await fetch(`http://localhost:3000/api/procesos/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();

			if (res.ok) {
				alert("Proceso actualizado ✅");
				navigate("/procesos");
			} else {
				alert("❌ " + data.message);
			}
		} catch (error) {
			console.error("Error al actualizar:", error);
			alert("Error al guardar los cambios");
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-8">
			<h2 className="text-2xl font-bold text-[#007c64] mb-6">
				Editar proceso #{id}
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

			{maquinas.map((m, i) => (
				<div key={m.IdMaquina} className="mb-6 border-t pt-4">
					<div className="flex items-center gap-4 mb-2">
						<img
							src={m.Imagen}
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
					onClick={guardarCambios}
					className="bg-[#007c64] text-white px-6 py-2 rounded hover:bg-[#006554]"
				>
					💾 Guardar cambios
				</button>
			</div>
		</div>
	);
}
