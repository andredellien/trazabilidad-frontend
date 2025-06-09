import { Navigate, Outlet } from "react-router-dom";

/**
 * Componente que protege rutas que requieren autenticación
 * • Si no hay token → redirige a login
 * • Si hay token → renderiza el contenido (Outlet)
 */
export default function ProtectedRoute() {
	const token = localStorage.getItem("token");

	if (!token) {
		// Redirigir a login si no hay token
		return <Navigate to="/" replace />;
	}

	// Si hay token, renderizar el contenido protegido
	return <Outlet />;
} 