import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	login as loginService,
	register as registerService,
} from "../../../shared/services/auth.service";
import api from "../../../shared/services/api";

/**
 * Hook central de autenticación
 * • login       → guarda JWT, inyecta header y redirige
 * • register    → crea usuario y luego llama a login
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
			navigate(redirect, { replace: true });
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
			await login(payload.Usuario, payload.Password);
		} catch (err) {
			setError(err.response?.data?.message || "Error al registrar");
			setLoading(false); // login() maneja su propio loading
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
