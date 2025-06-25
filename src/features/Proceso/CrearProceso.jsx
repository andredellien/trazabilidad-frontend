import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { createProceso, getProcesoById } from "./services/proceso.service";
import { getAllMaquinas } from "../Maquinas/services/maquinas.service";
import Modal from "../../shared/components/Modal";
import useVariablesEstandar from "../VariablesEstandar/hooks/useVariablesEstandar";
import { Select, MenuItem, InputLabel, FormControl, Box, TextField } from '@mui/material';

export default function CrearProceso() {
	const [searchParams] = useSearchParams();
	const baseId = searchParams.get("base");
	const [nombreProceso, setNombreProceso] = useState("");
	const [maquinasDisponibles, setMaquinasDisponibles] = useState([]);
	const [maquinasSeleccionadas, setMaquinasSeleccionadas] = useState([]);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
	const navigate = useNavigate();

	const { variables: variablesEstandar, fetchVariables } = useVariablesEstandar();

	useEffect(() => {
		fetchVariables();
	}, [fetchVariables]);

	// ✅ Cargar máquinas disponibles
	useEffect(() => {
		const cargarMaquinas = async () => {
			try {
				const data = await getAllMaquinas();
				setMaquinasDisponibles(data);
			} catch (error) {
				setError("Error al cargar las máquinas");
				console.error(error);
			}
		};
		cargarMaquinas();
	}, []);

	// ✅ Si viene desde duplicar, precargar proceso base
	useEffect(() => {
		const cargarBase = async () => {
			if (!baseId) return;

			try {
				const data = await getProcesoById(baseId);
				setNombreProceso(data.Nombre + " (Copia)");

				const maquinasProcesadas = data.Maquinas.map((m, i) => ({
					IdMaquina: m.IdMaquina,
					Nombre: m.Nombre,
					ImagenUrl: m.Imagen,
					numero: i + 1,
					variables: m.variables.map((v) => ({
						nombre: v.nombre || v.Nombre,
						min: v.min || v.ValorMin,
						max: v.max || v.ValorMax,
					})),
				}));

				setMaquinasSeleccionadas(maquinasProcesadas);
			} catch (error) {
				console.error("Error al duplicar proceso:", error);
				setModal({
					isOpen: true,
					title: "Error",
					message: "No se pudo duplicar el proceso",
					type: "error"
				});
			}
		};

		cargarBase();
	}, [baseId]);

	const agregarMaquina = (m) => {
		if (maquinasSeleccionadas.find((x) => x.IdMaquina === m.IdMaquina)) return;
		setMaquinasSeleccionadas([
			...maquinasSeleccionadas,
			{ 
				IdMaquina: m.IdMaquina,
				Nombre: m.Nombre,
				ImagenUrl: m.ImagenUrl,
				numero: maquinasSeleccionadas.length + 1, 
				variables: [] 
			},
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
		if (campo === 'nombre') {
			const variableSeleccionada = variablesEstandar.find(v => v.IdVariableEstandar === valor);
			nuevas[iMaquina].variables[iVar].IdVariableEstandar = variableSeleccionada ? variableSeleccionada.IdVariableEstandar : undefined;
			nuevas[iMaquina].variables[iVar].nombre = variableSeleccionada ? variableSeleccionada.Nombre : '';
			nuevas[iMaquina].variables[iVar].unidad = variableSeleccionada ? variableSeleccionada.Unidad : '';
		} else {
		nuevas[iMaquina].variables[iVar][campo] = valor;
		}
		setMaquinasSeleccionadas(nuevas);
	};

	const agregarVariable = (iMaquina) => {
		const nuevas = [...maquinasSeleccionadas];
		nuevas[iMaquina].variables.push({ nombre: "", unidad: "", min: 0, max: 0 });
		setMaquinasSeleccionadas(nuevas);
	};

	const validarProceso = () => {
		if (!nombreProceso.trim()) {
			setModal({
				isOpen: true,
				title: "Error de validación",
				message: "⚠️ Debes ingresar un nombre para el proceso",
				type: "warning"
			});
			return false;
		}

		for (const [i, maquina] of maquinasSeleccionadas.entries()) {
			if (!maquina.variables || maquina.variables.length === 0) {
				setModal({
					isOpen: true,
					title: "Error de validación",
					message: `⚠️ La máquina #${i + 1} (${maquina.Nombre}) no tiene variables`,
					type: "warning"
				});
				return false;
			}

			for (const [j, variable] of maquina.variables.entries()) {
				if (!variable.nombre || variable.nombre.trim() === "") {
					setModal({
						isOpen: true,
						title: "Error de validación",
						message: `⚠️ La variable #${j + 1} de la máquina ${maquina.Nombre} no tiene nombre`,
						type: "warning"
					});
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
					setModal({
						isOpen: true,
						title: "Error de validación",
						message: `⚠️ La variable "${variable.nombre}" debe tener valores numéricos en ambos campos`,
						type: "warning"
					});
					return false;
				}

				if (parseFloat(variable.min) > parseFloat(variable.max)) {
					setModal({
						isOpen: true,
						title: "Error de validación",
						message: `⚠️ En la variable "${variable.nombre}", el mínimo no puede ser mayor que el máximo`,
						type: "warning"
					});
					return false;
				}
			}
		}

		setError(null);
		return true;
	};

	const guardarProceso = async () => {
		if (!validarProceso()) return;
		
		try {
			// Validar que haya al menos una máquina seleccionada
			if (maquinasSeleccionadas.length === 0) {
				setModal({
					isOpen: true,
					title: "Error de validación",
					message: "⚠️ Debes seleccionar al menos una máquina",
					type: "warning"
				});
				return;
			}

			// Preparar el payload en el formato exacto que espera el backend
			const payload = {
				nombre: nombreProceso.trim(),
				maquinas: maquinasSeleccionadas.map((m, index) => ({
					IdMaquina: m.IdMaquina,
					numero: index + 1,
					nombre: m.Nombre,
					imagen: m.ImagenUrl,
					variables: m.variables.map(v => ({
						IdVariableEstandar: v.IdVariableEstandar,
						nombre: v.nombre.trim(),
						unidad: v.unidad,
						min: parseFloat(v.min),
						max: parseFloat(v.max)
					}))
				}))
			};

			// Validaciones adicionales según el backend
			if (!payload.nombre || !Array.isArray(payload.maquinas)) {
				setModal({
					isOpen: true,
					title: "Error de validación",
					message: "⚠️ Datos incompletos: nombre y máquinas son requeridos",
					type: "warning"
				});
				return;
			}

			// Validar cada máquina según el backend
			for (const maquina of payload.maquinas) {
				if (!maquina.IdMaquina || !maquina.numero || !maquina.nombre || !maquina.imagen || !Array.isArray(maquina.variables)) {
					setModal({
						isOpen: true,
						title: "Error de validación",
						message: `⚠️ La máquina ${maquina.nombre} debe tener ID, número, nombre, imagen y variables`,
						type: "warning"
					});
					return;
				}

				// Validar cada variable según el backend
				for (const variable of maquina.variables) {
					if (!variable.nombre || variable.min === undefined || variable.max === undefined) {
						setModal({
							isOpen: true,
							title: "Error de validación",
							message: `⚠️ La variable ${variable.nombre} debe tener nombre, min y max`,
							type: "warning"
						});
						return;
					}
				}
			}

			const response = await createProceso(payload);
			setError(null);
			setNombreProceso("");
			setMaquinasSeleccionadas([]);
			setModal({
				isOpen: true,
				title: "Éxito",
				message: "Proceso creado correctamente",
				type: "success"
			});
			navigate("/procesos");
		} catch (error) {
			console.error("Error al guardar el proceso:", error);
			const errorMessage = error.response?.data?.message || error.message;
			setModal({
				isOpen: true,
				title: "Error",
				message: `❌ Error al guardar el proceso: ${errorMessage}`,
				type: "error"
			});
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-8">
			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
			/>

			<h2 className="text-2xl font-bold text-[#007c64] mb-6">
				Crear nuevo proceso
			</h2>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="mb-6">
				<label
					htmlFor="nombreProceso"
					className="block text-gray-700 font-medium mb-1"
				>
					Nombre del proceso
				</label>
				<input
					id="nombreProceso"
					className="w-full border p-2 rounded"
					type="text"
					value={nombreProceso}
					onChange={(e) => setNombreProceso(e.target.value)}
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
						<Box key={j} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
							<FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
								<InputLabel id={`var-label-${i}-${j}`}>Variable</InputLabel>
								<Select
									labelId={`var-label-${i}-${j}`}
									value={v.IdVariableEstandar || ''}
									label="Variable"
									onChange={e => actualizarVariable(i, j, 'nombre', Number(e.target.value))}
									required
								>
									<MenuItem value="">
										<em>Seleccionar variable…</em>
									</MenuItem>
									{variablesEstandar.map(v => (
										<MenuItem key={v.IdVariableEstandar} value={v.IdVariableEstandar}>
											{v.Nombre}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								label="Unidad"
								value={v.unidad || ''}
								InputProps={{ readOnly: true }}
								variant="outlined"
								size="small"
								sx={{ minWidth: 100, background: '#f5f5f5' }}
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
						</Box>
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
