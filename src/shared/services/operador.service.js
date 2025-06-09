import api from "./api";

export const getAllOperadores = async () => {
    const response = await api.get("/operador");
    return response.data;
};

export const getOperadorById = async (id) => {
    const response = await api.get(`/operador/${id}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const updateOperador = async (id, operador) => {
    const response = await api.put(`/operador/${id}`, operador);
    return response.data;
};

export const deleteOperador = async (id) => {
    const response = await api.delete(`/operador/${id}`);
    return response.data;
};

export const getAllMaquinas = async () => {
    const response = await api.get("/maquinas");
    return response.data;
};

export const asignarMaquinas = async (operadorId, maquinaIds) => {
    const response = await api.post(`/operador/${operadorId}/maquinas`, { maquinaIds });
    return response.data;
};

export const obtenerMaquinasAsignadas = async (operadorId) => {
    const response = await api.get(`/operador/${operadorId}/maquinas`);
    return response.data;
}; 