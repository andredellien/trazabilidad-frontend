import React, { useState } from "react";
import useOperadores from "./hooks/useOperadores";
import useAuth from "../Auth/hooks/useAuth";
import OperadoresList from "./components/OperadoresList";
import Modal from "../../shared/components/Modal";
import Button from "../../shared/components/Button";
import Alert from "../../shared/components/Alert";
import Input from "../../shared/components/Input";
import Select from "../../shared/components/Select";
import Card from "../../shared/components/Card";

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
		<div className="p-6 max-w-7xl mx-auto">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-primary mb-4">
					👥 Gestión de Usuarios
				</h1>
				<p className="text-lg text-secondary">
					Administre usuarios y operadores del sistema
				</p>
			</div>

			<div className="space-y-8">
				{/* Formulario de creación */}
				<Card title="Crear Nuevo Usuario">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								id="nombre"
								name="nombre"
								label="Nombre completo"
								type="text"
								required
							/>

							<Select
								id="cargo"
								name="cargo"
								label="Cargo"
								required
								placeholder="Seleccione un cargo"
								options={[
									{ value: "admin", label: "Administrador" },
									{ value: "operador", label: "Operador" },
									{ value: "cliente", label: "Cliente" }
								]}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								id="usuario"
								name="usuario"
								label="Usuario"
								type="text"
								required
							/>

							<Input
								id="password"
								name="password"
								label="Contraseña"
								type="password"
								required
							/>
						</div>

						<Input
							id="confirmPassword"
							name="confirmPassword"
							label="Confirmar Contraseña"
							type="password"
							required
						/>

						{error && <Alert type="error">{error}</Alert>}

						<Button
							type="submit"
							disabled={loading}
							loading={loading}
							fullWidth
							size="lg"
						>
							{loading ? "Creando..." : "Crear Usuario"}
						</Button>
					</form>
				</Card>

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