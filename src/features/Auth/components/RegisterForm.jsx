// src/features/auth/components/RegisterForm.jsx
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Input from "../../../shared/components/Input";
import Card from "../../../shared/components/Card";

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
		<div className="flex items-center justify-center min-h-screen bg-secondary p-4">
			<Card className="w-full max-w-md">
				<div className="text-center mb-6">
					<h2 className="text-3xl font-bold text-primary mb-2">Crear cuenta</h2>
					<p className="text-secondary">Regístrate para acceder al sistema</p>
				</div>

				{error && <Alert type="error" className="mb-4">{error}</Alert>}
				{mismatch && <Alert type="error" className="mb-4">Las contraseñas no coinciden.</Alert>}

				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						id="Nombre"
						name="Nombre"
						label="Nombre completo"
						value={form.Nombre}
						onChange={onChange}
						required
					/>

					<Input
						id="Cargo"
						name="Cargo"
						label="Cargo / Rol"
						value={form.Cargo}
						onChange={onChange}
						required
					/>

					<Input
						id="Usuario"
						name="Usuario"
						label="Usuario"
						value={form.Usuario}
						onChange={onChange}
						required
					/>

					<Input
						id="Password"
						name="Password"
						label="Contraseña"
						type="password"
						value={form.Password}
						onChange={onChange}
						required
					/>

					<Input
						id="Confirm"
						name="Confirm"
						label="Confirmar contraseña"
						type="password"
						value={form.Confirm}
						onChange={onChange}
						required
					/>

					<Button 
						type="submit" 
						disabled={loading} 
						loading={loading}
						fullWidth
						size="lg"
					>
						{loading ? "Creando…" : "Registrar"}
					</Button>

					<div className="text-center mt-4">
						<p className="text-sm text-secondary">
							¿Ya tienes cuenta?{" "}
							<a href="/" className="text-primary font-medium hover:underline">
								Inicia sesión
							</a>
						</p>
					</div>
				</form>
			</Card>
		</div>
	);
}
