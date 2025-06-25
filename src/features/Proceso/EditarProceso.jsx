import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProcesoById, updateProceso } from "./services/proceso.service";
import Modal from "../../shared/components/Modal";
import useVariablesEstandar from "../VariablesEstandar/hooks/useVariablesEstandar";
import { Select, MenuItem, InputLabel, FormControl, Box, TextField } from '@mui/material';

export default function EditarProceso() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [nombreProceso, setNombreProceso] = useState("");
	const [maquinas, setMaquinas] = useState([]);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });

	const { variables: variablesEstandar, fetchVariables } = useVariablesEstandar();

	useEffect(() => {
		fetchVariables();
	}, [fetchVariables]);

	useEffect(() => {
		const cargarProceso = async () => {
			try {
				const data = await getProcesoById(id);

				const maquinasProcesadas = data.Maquinas.map((m, i) => ({
					...m,
					numero: i + 1,
					variables: Array.isArray(m.variables)
						? m.variables.map((v) => {
							const variableEstandar = variablesEstandar.find(ve => ve.Nombre === (v.nombre || v.Nombre));
							return {
								IdVariableEstandar: variableEstandar ? variableEstandar.IdVariableEstandar : undefined,
								nombre: v.nombre || v.Nombre,
								unidad: variableEstandar ? variableEstandar.Unidad : v.unidad || v.Unidad || '',
								min: v.min || v.ValorMin,
								max: v.max || v.ValorMax,
							};
						})
						: [],
				}));

				setNombreProceso(data.Nombre);
				setMaquinas(maquinasProcesadas);
			} catch (error) {
				console.error("Error al cargar proceso:", error);
				setModal({
					isOpen: true,
					title: "Error",
					message: "No se pudo cargar el proceso",
					type: "error"
				});
			}
		};

		cargarProceso();
	// eslint-disable-next-line
	}, [id, variablesEstandar]);

	const actualizarVariable = (iMaquina, iVar, campo, valor) => {
		const nuevas = [...maquinas];
		if (campo === 'nombre') {
			const variableSeleccionada = variablesEstandar.find(v => v.IdVariableEstandar === valor);
			nuevas[iMaquina].variables[iVar].IdVariableEstandar = variableSeleccionada ? variableSeleccionada.IdVariableEstandar : undefined;
			nuevas[iMaquina].variables[iVar].nombre = variableSeleccionada ? variableSeleccionada.Nombre : '';
			nuevas[iMaquina].variables[iVar].unidad = variableSeleccionada ? variableSeleccionada.Unidad : '';
		} else {
		nuevas[iMaquina].variables[iVar][campo] = valor;
		}
		setMaquinas(nuevas);
	};

	const eliminarVariable = (iMaquina, iVar) => {
		const nuevas = [...maquinas];
		nuevas[iMaquina].variables = nuevas[iMaquina].variables.filter((_, i) => i !== iVar);
		setMaquinas(nuevas);
	};

	const agregarVariable = (iMaquina) => {
		const nuevas = [...maquinas];
		nuevas[iMaquina].variables.push({ nombre: "", unidad: "", min: 0, max: 0 });
		setMaquinas(nuevas);
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

		for (const [i, maquina] of maquinas.entries()) {
			if (!maquina.variables || maquina.variables.length === 0) {
				setModal({
					isOpen: true,
					title: "Error de validación",
					message: `⚠️ La máquina #${i + 1} (${maquina.Nombre || maquina.nombre}) no tiene variables`,
					type: "warning"
				});
				return false;
			}

			for (const [j, variable] of maquina.variables.entries()) {
				if (!variable.nombre || variable.nombre.trim() === "") {
					setModal({
						isOpen: true,
						title: "Error de validación",
						message: `⚠️ La variable #${j + 1} de la máquina ${maquina.Nombre || maquina.nombre} no tiene nombre`,
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
					IdVariableEstandar: v.IdVariableEstandar,
					nombre: v.nombre,
					unidad: v.unidad,
					min: v.min,
					max: v.max,
				})),
			})),
		};

		try {
			await updateProceso(id, payload);
			setModal({
				isOpen: true,
				title: "Éxito",
				message: "Proceso actualizado",
				type: "success"
			});
			navigate("/procesos");
		} catch (error) {
			console.error("Error al actualizar:", error);
			const mensajeError = error.response?.data?.message || error.message || "Error al guardar los cambios";
			setModal({
				isOpen: true,
				title: "Error",
				message: mensajeError,
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
					onClick={guardarCambios}
					className="bg-[#007c64] text-white px-6 py-2 rounded hover:bg-[#006554]"
				>
					💾 Guardar cambios
				</button>
			</div>
		</div>
	);
}
