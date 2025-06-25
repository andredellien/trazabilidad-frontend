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
			Cargo: formData.get("cargo"),
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
				message: "Usuario creado correctamente",
				type: "success"
			});
		} catch (error) {
			console.error("Error al crear usuario:", error);
			setModal({
				isOpen: true,
				title: "Error",
				message: "Error al crear el usuario",
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
						<h2 className="mp-heading">Crear Nuevo Usuario</h2>
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
								<label htmlFor="cargo" className="mp-label">
									Cargo
								</label>
								<select
									name="cargo"
									id="cargo"
									required
									className="mp-input"
								>
									<option value="">Seleccione un cargo</option>
									<option value="admin">Administrador</option>
									<option value="operador">Operador</option>
									<option value="cliente">Cliente</option>
								</select>
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
								{loading ? "Creando..." : "Crear Usuario"}
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