import { useState } from "react";
import useAuth from "../hooks/useAuth";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Input from "../../../shared/components/Input";
import Card from "../../../shared/components/Card";

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
		<div className="flex items-center justify-center min-h-screen bg-secondary p-4">
			<Card className="w-full max-w-md">
				<div className="text-center mb-6">
					<h2 className="text-3xl font-bold text-primary mb-2">Iniciar sesión</h2>
					<p className="text-secondary">Ingresa tus credenciales para acceder</p>
				</div>

				{error && <Alert type="error" className="mb-4">{error}</Alert>}

				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						id="usuario"
						label="Usuario"
						placeholder="Usuario"
						value={user}
						onChange={(e) => setUser(e.target.value)}
						required
					/>

					<Input
						id="password"
						label="Contraseña"
						type="password"
						placeholder="Contraseña"
						value={pass}
						onChange={(e) => setPass(e.target.value)}
						required
					/>

					<Button 
						type="submit" 
						disabled={loading} 
						loading={loading}
						fullWidth
						size="lg"
					>
						{loading ? "Entrando…" : "Entrar"}
					</Button>
				</form>
			</Card>
		</div>
	);
}

/* Agrega en tu CSS global si aún no existen

*/
