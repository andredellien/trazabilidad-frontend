import api from "./api";

export const login = (usuario, password) =>
	api.post("/auth/login", { Usuario: usuario, Password: password });

export const register = (payload) => api.post("/auth/register", payload);
