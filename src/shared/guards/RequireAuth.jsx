import { Navigate, useLocation } from "react-router-dom";

/**
 * Envuelve cualquier página privada.
 * Si no hay token ⇒ redirige a /login
 */
export default function RequireAuth({ children }) {
	const token = localStorage.getItem("token");
	const location = useLocation(); // para volver a la ruta tras login

	if (!token) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// Hay token  ⇒  se permite ver la página
	return children;
}
