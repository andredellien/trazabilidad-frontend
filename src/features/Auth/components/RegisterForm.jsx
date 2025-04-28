// src/features/auth/components/RegisterForm.jsx
import { useState } from "react";
import useAuth from "../hooks/useAuth";

/**
 * Formulario de registro (CSS vanilla · tema corporativo #007c64)
 * Reutiliza las clases mp-* globales.
 */
export default function RegisterForm() {
	const [form, setForm] = useState({
		Nombre: "",
		Cargo: "",
		Usuario: "",
		Password: "",
		Confirm: "",
	});

	const { register, loading, error } = useAuth();
	const [mismatch, setMismatch] = useState(false);

	const onChange = (e) => {
		const next = { ...form, [e.target.name]: e.target.value };
		setForm(next);
		if (e.target.name === "Confirm") {
			setMismatch(next.Password !== next.Confirm);
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		if (form.Password !== form.Confirm) {
			setMismatch(true);
			return;
		}
		register({
			Nombre: form.Nombre,
			Cargo: form.Cargo,
			Usuario: form.Usuario,
			Password: form.Password,
		});
	};

	return (
		<div className="mp-form-wrapper" style={{ maxWidth: 480 }}>
			<div className="mp-form-card">
				<h2 className="mp-heading">Crear cuenta</h2>

				{error && <p className="mp-error">{error}</p>}
				{mismatch && <p className="mp-error">Las contraseñas no coinciden.</p>}

				<form onSubmit={onSubmit} className="mp-form">
					<div className="mp-field">
						<label className="mp-label" htmlFor="Nombre">
							Nombre completo
						</label>
						<input
							id="Nombre"
							name="Nombre"
							value={form.Nombre}
							onChange={onChange}
							className="mp-input"
							required
						/>
					</div>

					<div className="mp-field">
						<label className="mp-label" htmlFor="Cargo">
							Cargo / Rol
						</label>
						<input
							id="Cargo"
							name="Cargo"
							value={form.Cargo}
							onChange={onChange}
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
							onChange={onChange}
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
							onChange={onChange}
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
							onChange={onChange}
							className="mp-input"
							required
						/>
					</div>

					<button type="submit" className="mp-button" disabled={loading}>
						{loading ? "Creando…" : "Registrar"}
					</button>

					<p className="mp-small">
						¿Ya tienes cuenta?{" "}
						<a href="/" className="mp-link">
							Inicia sesión
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
