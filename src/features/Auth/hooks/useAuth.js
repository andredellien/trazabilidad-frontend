import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	login as loginService,
	register as registerService,
} from "../../../shared/services/auth.service";
import api from "../../../shared/services/api";
import { getMe } from "../../../shared/services/auth.service";

/**
 * Hook central de autenticación
 * • login       → guarda JWT, inyecta header y redirige
 * • register    → crea usuario
 * • logout      → limpia token y vuelve a raíz (/)
 */
export default function useAuth() {
	const navigate = useNavigate();
	const location = useLocation();
	const redirect = location.state?.from?.pathname || "/dashboard";

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// ────────────────────────────────────────── LOGIN
	async function login(usuario, password) {
		setLoading(true);
		setError(null);
		try {
			const { data } = await loginService(usuario, password); // { token }
			localStorage.setItem("token", data.token);
			api.defaults.headers.Authorization = `Bearer ${data.token}`;

			// Obtener el usuario y redirigir según el cargo
			const me = await getMe();
			const cargo = me.data?.Cargo?.toLowerCase();
			if (cargo === "admin") {
				navigate("/dashboard", { replace: true });
			} else if (cargo === "cliente") {
				navigate("/dashboard-cliente", { replace: true });
			} else {
				navigate("/dashboard", { replace: true });
			}
		} catch (err) {
			setError(err.response?.data?.message || "Error al iniciar sesión");
		} finally {
			setLoading(false);
		}
	}

	// ────────────────────────────────────────── REGISTER
	async function register(payload) {
		setLoading(true);
		setError(null);
		try {
			await registerService(payload); // { message: 'Usuario registrado' }
			return true;
		} catch (err) {
			setError(err.response?.data?.message || "Error al registrar");
			return false;
		} finally {
			setLoading(false);
		}
	}

	// ────────────────────────────────────────── LOGOUT
	function logout() {
		localStorage.removeItem("token");
		delete api.defaults.headers.Authorization;
		navigate("/", { replace: true }); // ruta pública (login)
	}

	return { login, register, logout, loading, error };
}
