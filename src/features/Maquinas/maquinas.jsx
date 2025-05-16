import React, { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi"; // para ícono visual

export default function Maquinas() {
	const [maquinas, setMaquinas] = useState([]);
	const [nombre, setNombre] = useState("");
	const [imagen, setImagen] = useState(null);
	const [imagenUrl, setImagenUrl] = useState("");
	const [cargando, setCargando] = useState(false);

	useEffect(() => {
		cargarMaquinas();
	}, []);

	const cargarMaquinas = async () => {
		const res = await fetch("http://localhost:3000/api/maquinas");
		const data = await res.json();
		setMaquinas(data);
	};

	const subirImagen = async () => {
		if (!imagen) return;
		const formData = new FormData();
		formData.append("imagen", imagen);
		setCargando(true);

		const res = await fetch("http://localhost:3000/api/maquinas/upload", {
			method: "POST",
			body: formData,
		});
		const data = await res.json();
		setImagenUrl(data.imageUrl);
		setCargando(false);
	};

	const guardarMaquina = async () => {
		if (!nombre || !imagenUrl) return alert("Completa todos los campos");

		const res = await fetch("http://localhost:3000/api/maquinas", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre, imagenUrl }),
		});
		const data = await res.json();
		if (res.ok) {
			alert("Máquina guardada ✅");
			setNombre("");
			setImagen(null);
			setImagenUrl("");
			cargarMaquinas();
		} else {
			alert("❌ " + data.message);
		}
	};

	return (
		<div className="max-w-5xl mx-auto p-6 bg-white shadow rounded mt-8">
			<h2 className="text-2xl font-bold text-[#007c64] mb-6">
				Gestión de Máquinas
			</h2>

			{/* Formulario de creación */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-gray-50 p-6 rounded border">
				<div>
					<label className="block font-medium text-gray-700 mb-1">
						Nombre de la máquina
					</label>
					<input
						type="text"
						placeholder="Ej: Balanza automática"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
						className="w-full border p-2 rounded"
					/>

					{imagenUrl && (
						<div className="mt-4">
							<label className="block font-medium text-gray-700 mb-1">
								Previsualización
							</label>
							<img
								src={imagenUrl}
								alt="Preview"
								className="w-40 h-40 object-cover rounded border shadow"
							/>
						</div>
					)}
				</div>

				<div className="flex flex-col justify-between">
					<label className="block font-medium text-gray-700 mb-2">
						Imagen de la máquina
					</label>

					<label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100">
						<FiUploadCloud className="text-4xl text-gray-500 mb-2" />
						<p className="text-gray-600 text-sm text-center">
							{imagen ? imagen.name : "Haz clic para seleccionar una imagen"}
						</p>
						<input
							type="file"
							className="hidden"
							onChange={(e) => setImagen(e.target.files[0])}
						/>
					</label>

					<button
						onClick={subirImagen}
						disabled={!imagen || cargando}
						className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
					>
						{cargando ? "Subiendo..." : "📤 Subir imagen"}
					</button>

					<button
						onClick={guardarMaquina}
						disabled={!nombre || !imagenUrl}
						className="mt-4 bg-[#007c64] text-white px-4 py-2 rounded hover:bg-[#006554] transition"
					>
						💾 Guardar máquina
					</button>
				</div>
			</div>

			{/* Lista de máquinas */}
			<div>
				<h3 className="text-lg font-semibold text-gray-800 mb-3">
					Máquinas registradas
				</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{maquinas.map((m) => (
						<div
							key={m.IdMaquina}
							className="border rounded p-3 shadow-sm bg-white"
						>
							<img
								src={m.ImagenUrl}
								alt={m.Nombre}
								className="w-full h-40 object-contain mb-2 rounded "
							/>
							<p className="text-center font-medium text-gray-700">
								{m.Nombre}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
