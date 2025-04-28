/* eslint-disable no-irregular-whitespace */
/**
 * Instancia central de Axios para todo el frontend.
 * Aquí se define el dominio base de la API, encabezados comunes
 * y (en el futuro) se inyecta automáticamente el token JWT.
 */

import axios from "axios";

// ─────────────────────────────────────────────────────────────
// 1) BASE URL
//    • En desarrollo usa localhost:3000
//    • En producción pon REACT_APP_API_URL en tu .env.prod
// ─────────────────────────────────────────────────────────────
const baseURL =
	// quita barras finales
	"http://localhost:3000";

// La API back‑end expone todos los endpoints bajo /api
// Ej.: http://localhost:3000/api/lote
const api = axios.create({
	baseURL: `${baseURL}/api`,
	timeout: 15000, // 15 segundos
	headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────────────────────
// 2) INTERCEPTOR DE PETICIÓN
//    Si el token existe lo añadimos al header Authorization
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token"); // o cookies
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ─────────────────────────────────────────────────────────────
// 3) INTERCEPTOR DE RESPUESTA
//    Manejo global de errores (log, redirección 401, etc.)
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
	(res) => res,
	(err) => {
		const status = err.response?.status;
		console.error("Error API:", status, err.message);

		// Ejemplo: si no autorizado → volver al login
		if (status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/";
		}

		// Rechazar para que el caller maneje el error también
		return Promise.reject(err);
	}
);

export default api;
