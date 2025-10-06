import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi"; // para ícono visual
import { getAllMaquinas, createMaquina } from "./services/maquinas.service";
import api from "../../shared/services/api";
import Modal from "../../shared/components/Modal";

export default function Maquinas() {
	const [maquinas, setMaquinas] = useState([]);
	const [nombre, setNombre] = useState("");
	const [imagen, setImagen] = useState(null);
	const [imagenUrl, setImagenUrl] = useState("");
	const [cargando, setCargando] = useState(false);
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });

	useEffect(() => {
		cargarMaquinas();
	}, []);

	const cargarMaquinas = async () => {
		try {
			const data = await getAllMaquinas();
			setMaquinas(data);
		} catch (error) {
			console.error("Error al cargar máquinas:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al cargar las máquinas",
				type: "error"
			});
		}
	};

	const subirImagen = async (archivo) => {
		if (!archivo) return;
		const formData = new FormData();
		formData.append("imagen", archivo);
		setCargando(true);

		try {
			const response = await api.post("/maquinas/upload", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			setImagenUrl(response.data.imageUrl);
			setImagen(archivo);
		} catch (error) {
			console.error("Error al subir imagen:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al subir la imagen",
				type: "error"
			});
		} finally {
			setCargando(false);
		}
	};

	// Maneja la selección de archivo desde el input oculto
	const manejarSeleccionArchivo = (e) => {
		const archivo = e.target.files[0];
		if (archivo) {
			subirImagen(archivo);
		}
	};

	// Maneja la selección de archivo desde el botón
	const manejarClickBotonSubir = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e) => {
			const archivo = e.target.files[0];
			if (archivo) {
				subirImagen(archivo);
			}
		};
		input.click();
	};

	const guardarMaquina = async () => {
		if (!nombre || !imagenUrl) {
			setModal({
				isOpen: true,
				title: "Campos incompletos",
				message: "Por favor completa todos los campos",
				type: "warning"
			});
			return;
		}

		try {
			await createMaquina({ nombre, imagenUrl });
			setModal({
				isOpen: true,
				title: "Éxito",
				message: "Máquina guardada",
				type: "success"
			});
			setNombre("");
			setImagen(null);
			setImagenUrl("");
			cargarMaquinas();
		} catch (error) {
			console.error("Error al guardar máquina:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al guardar la máquina",
				type: "error"
			});
		}
	};

	return (
		<div className="p-4 min-h-screen bg-secondary">
			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
				showConfirmButton={modal.showConfirmButton}
			/>

			{/* Header */}
			<div className="mb-6">
				<h2 className="text-3xl font-bold text-[#007c64]">
					Gestión de Máquinas
				</h2>
				<p className="text-secondary mt-2">
					Administra y registra las máquinas del sistema
				</p>
			</div>

			{/* Fila 1: Formulario de creación - 2 columnas */}
			<div className="grid grid-cols-2 gap-6 mb-8">
				{/* Columna 1: Datos de la máquina */}
				<div className="bg-white shadow rounded p-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Información de la Máquina
					</h3>
					
					<div className="mb-4">
						<label className="block font-medium text-gray-700 mb-2">
							Nombre de la máquina
						</label>
						<input
							type="text"
							placeholder="Ej: Balanza automática"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007c64]"
						/>
					</div>

					{imagenUrl && (
						<div>
							<label className="block font-medium text-gray-700 mb-2">
								Previsualización
							</label>
							<div className="flex justify-center">
								<img
									src={imagenUrl}
									alt="Preview"
									className="w-48 h-48 object-contain rounded border shadow bg-white"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Columna 2: Carga de imagen */}
				<div className="bg-white shadow rounded p-6">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						Imagen de la Máquina
					</h3>

					<label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100 mb-4">
						<FiUploadCloud className="text-5xl text-gray-500 mb-3" />
						<p className="text-gray-600 text-center">
							{cargando ? "Subiendo imagen..." : 
							 imagen ? `Imagen cargada: ${imagen.name}` : 
							 "Haz clic para seleccionar y subir una imagen"}
						</p>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={manejarSeleccionArchivo}
							disabled={cargando}
						/>
					</label>

					<div className="space-y-3">
						<button
							onClick={manejarClickBotonSubir}
							disabled={cargando}
							className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{cargando ? "Subiendo..." : "Subir imagen"}
						</button>

						<button
							onClick={guardarMaquina}
							disabled={!nombre || !imagenUrl}
							className="w-full bg-[#007c64] text-white px-4 py-3 rounded hover:bg-[#006554] transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Guardar máquina	
						</button>
					</div>
				</div>
			</div>

			{/* Fila 2: Máquinas registradas - 3 columnas iguales */}
			<div className="bg-white shadow rounded p-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-6">
					Máquinas registradas ({maquinas.length})
				</h3>
				
				{maquinas.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<FiUploadCloud className="text-6xl mx-auto mb-3" />
						</div>
						<p className="text-gray-500 text-lg">
							No hay máquinas registradas
						</p>
						<p className="text-gray-400">
							Agrega tu primera máquina usando el formulario de arriba
						</p>
					</div>
				) : (
					<div className="grid grid-cols-3 gap-6">
						{maquinas.map((m) => (
							<div
								key={m.IdMaquina}
								className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
							>
								<div className="mb-4">
									<img
										src={m.ImagenUrl}
										alt={m.Nombre}
										className="w-full h-48 object-contain rounded border bg-white"
									/>
								</div>
								<div className="text-center">
									<p className="font-semibold text-gray-800 text-lg">
										{m.Nombre}
									</p>
									<p className="text-sm text-gray-500 mt-1">
										ID: #{m.IdMaquina}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}