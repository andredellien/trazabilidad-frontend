import { useState } from "react";
import useAuth from "../hooks/useAuth";

/**
 * Formulario de inicio de sesión (CSS vanilla + tema #007c64)
 */
export default function LoginForm() {
	const [user, setUser] = useState("");
	const [pass, setPass] = useState("");
	const { login, loading, error } = useAuth();

	const onSubmit = (e) => {
		e.preventDefault();
		login(user, pass);
	};

	return (
		<div className="mp-form-wrapper" style={{ maxWidth: 400 }}>
			<div className="mp-form-card">
				<h2 className="mp-heading">Iniciar sesión</h2>

				{error && <p className="mp-error">{error}</p>}

				<form onSubmit={onSubmit} className="mp-form">
					<div className="mp-field">
						<label htmlFor="usuario" className="mp-label">
							Usuario
						</label>
						<input
							id="usuario"
							placeholder="Usuario"
							value={user}
							onChange={(e) => setUser(e.target.value)}
							required
							className="mp-input"
						/>
					</div>

					<div className="mp-field">
						<label htmlFor="password" className="mp-label">
							Contraseña
						</label>
						<input
							id="password"
							type="password"
							placeholder="Contraseña"
							value={pass}
							onChange={(e) => setPass(e.target.value)}
							required
							className="mp-input"
						/>
					</div>

					<button type="submit" disabled={loading} className="mp-button">
						{loading ? "Entrando…" : "Entrar"}
					</button>

					<p className="mp-small">
						¿No tienes cuenta?{" "}
						<a href="/register" className="mp-link">
							Regístrate
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}

/* Agrega en tu CSS global si aún no existen

*/
