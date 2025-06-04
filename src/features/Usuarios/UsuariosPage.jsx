import React, { useState } from "react";
import useAuth from "../Auth/hooks/useAuth";
import useUser from "../Auth/hooks/useUser";

export default function UsuariosPage() {
	const { register } = useAuth();
	const { user, loading: loadingUser } = useUser();
	const [form, setForm] = useState({
		Nombre: "",
		Usuario: "",
		Password: "",
		Confirm: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (form.Password !== form.Confirm) {
			setError("Las contraseñas no coinciden");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await register({
				Nombre: form.Nombre,
				Usuario: form.Usuario,
				Password: form.Password,
				Cargo: "operador", // Automatically set to "operador"
			});
			setSuccess(true);
			setForm({
				Nombre: "",
				Usuario: "",
				Password: "",
				Confirm: "",
			});
		} catch (err) {
			setError(err.response?.data?.message || "Error al crear el usuario");
		} finally {
			setLoading(false);
		}
	};

	if (loadingUser) {
		return <div className="mp-form-wrapper">Cargando...</div>;
	}

	if (!user || user.Cargo !== "admin") {
		return (
			<div className="mp-form-wrapper">
				<div className="mp-form-card">
					<p className="mp-error">No tienes permisos para acceder a esta sección.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mp-form-wrapper" style={{ maxWidth: 480 }}>
			<div className="mp-form-card">
				<h2 className="mp-heading">Crear Usuario Operador</h2>

				{error && <p className="mp-error">{error}</p>}
				{success && <p className="mp-success">Usuario creado correctamente.</p>}

				<form onSubmit={handleSubmit} className="mp-form">
					<div className="mp-field">
						<label className="mp-label" htmlFor="Nombre">
							Nombre completo
						</label>
						<input
							id="Nombre"
							name="Nombre"
							value={form.Nombre}
							onChange={handleChange}
							className="mp-input"
							required
						/>
					</div>

					<div className="mp-field">
						<label className="mp-label" htmlFor="Usuario">
							Usuario
						</label>
						<input
							id="Usuario"
							name="Usuario"
							value={form.Usuario}
							onChange={handleChange}
							className="mp-input"
							required
						/>
					</div>

					<div className="mp-field">
						<label className="mp-label" htmlFor="Password">
							Contraseña
						</label>
						<input
							id="Password"
							name="Password"
							type="password"
							value={form.Password}
							onChange={handleChange}
							className="mp-input"
							required
						/>
					</div>

					<div className="mp-field">
						<label className="mp-label" htmlFor="Confirm">
							Confirmar contraseña
						</label>
						<input
							id="Confirm"
							name="Confirm"
							type="password"
							value={form.Confirm}
							onChange={handleChange}
							className="mp-input"
							required
						/>
					</div>

					<button type="submit" className="mp-button" disabled={loading}>
						{loading ? "Creando..." : "Crear usuario"}
					</button>
				</form>
			</div>
		</div>
	);
} 