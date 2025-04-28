import { useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";

export default function useLogout() {
	const navigate = useNavigate();

	function logout() {
		// 1) quitar token del almacenamiento
		localStorage.removeItem("token");
		// 2) limpiar header por si quedó configurado
		delete api.defaults.headers.Authorization;
		// 3) redirigir al login
		navigate("/", { replace: true });
	}

	return logout;
}
