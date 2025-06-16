import React, { useState } from "react";
import useOperadores from "./hooks/useOperadores";
import useAuth from "../Auth/hooks/useAuth";
import OperadoresList from "./components/OperadoresList";
import Modal from "../../shared/components/Modal";

export default function UsuariosPage() {
	const { user } = useAuth();
	const { createUser, error, loading, fetchOperadores, operadores, maquinas, asignarMaquinas } = useOperadores();
	const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info", showConfirmButton: false });

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
			setModal({
				isOpen: true,
				title: "Error de validación",
				message: "Las contraseñas no coinciden",
				type: "error"
			});
			return;
		}

		try {
			await createUser(data);
			e.target.reset();
			await fetchOperadores();
			setModal({
				isOpen: true,
				title: "Éxito",
				message: "Operador creado correctamente",
				type: "success"
			});
		} catch (error) {
			console.error("Error al crear usuario:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al crear el operador",
				type: "error"
			});
		}
	};

	return (
		<div className="container mx-auto px-4 ">
			<div className="space-y-8">
				{/* Formulario de creación */}
				<div className="mp-form-wrapper">
					<div className="mp-form-card">
						<h2 className="mp-heading">Crear Nuevo Operador</h2>
						<form onSubmit={handleSubmit} className="mp-form">
							<div className="mp-field">
								<label htmlFor="nombre" className="mp-label">
									Nombre
								</label>
								<input
									type="text"
									name="nombre"
									id="nombre"
									required
									className="mp-input"
								/>
							</div>

							<div className="mp-field">
								<label htmlFor="usuario" className="mp-label">
									Usuario
								</label>
								<input
									type="text"
									name="usuario"
									id="usuario"
									required
									className="mp-input"
								/>
							</div>

							<div className="mp-field">
								<label htmlFor="password" className="mp-label">
									Contraseña
								</label>
								<input
									type="password"
									name="password"
									id="password"
									required
									className="mp-input"
								/>
							</div>

							<div className="mp-field">
								<label htmlFor="confirmPassword" className="mp-label">
									Confirmar Contraseña
								</label>
								<input
									type="password"
									name="confirmPassword"
									id="confirmPassword"
									required
									className="mp-input"
								/>
							</div>

							{error && <p className="mp-error">{error}</p>}

							<button
								type="submit"
								disabled={loading}
								className="mp-button"
							>
								{loading ? "Creando..." : "Crear Operador"}
							</button>
						</form>
					</div>
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

			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
				showConfirmButton={modal.showConfirmButton}
			/>
		</div>
	);
} 