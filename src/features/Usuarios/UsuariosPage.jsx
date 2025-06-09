import React from "react";
import useOperadores from "./hooks/useOperadores";
import useAuth from "../Auth/hooks/useAuth";
import OperadoresList from "./components/OperadoresList";

export default function UsuariosPage() {
	const { user } = useAuth();
	const { createUser, error, loading, fetchOperadores, operadores, maquinas, asignarMaquinas } = useOperadores();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = {
			Nombre: formData.get("nombre"),
			Cargo: "operador",
			Usuario: formData.get("usuario"),
			Password: formData.get("password"),
		};

		if (data.Password !== formData.get("confirmPassword")) {
			alert("Las contraseñas no coinciden");
			return;
		}

		try {
			await createUser(data);
			e.target.reset();
			await fetchOperadores();
		} catch (error) {
			console.error("Error al crear usuario:", error);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="space-y-8">
				{/* Formulario de creación */}
				<div className="bg-white shadow rounded-lg p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-6">Crear Nuevo Operador</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
								Nombre
							</label>
							<input
								type="text"
								name="nombre"
								id="nombre"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>

						<div>
							<label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
								Usuario
							</label>
							<input
								type="text"
								name="usuario"
								id="usuario"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Contraseña
							</label>
							<input
								type="password"
								name="password"
								id="password"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirmar Contraseña
							</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								required
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
							/>
						</div>

						<div className="pt-4">
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								{loading ? "Creando..." : "Crear Operador"}
							</button>
						</div>

						{error && (
							<div className="rounded-md bg-red-50 p-4">
								<div className="flex">
									<div className="ml-3">
										<h3 className="text-sm font-medium text-red-800">{error}</h3>
									</div>
								</div>
							</div>
						)}
					</form>
				</div>

				{/* Lista de operadores */}
				<OperadoresList 
					operadores={operadores}
					maquinas={maquinas}
					loading={loading}
					error={error}
					asignarMaquinas={asignarMaquinas}
				/>
			</div>
		</div>
	);
} 