import api from "../../../shared/services/api";

export const getAllProcesos = async () => {
    const response = await api.get("/procesos");
    return response.data;
};

export const getProcesoById = async (id) => {
    const response = await api.get(`/procesos/${id}`);
    return response.data;
};

export const createProceso = async (proceso) => {
    const response = await api.post("/procesos", proceso);
    return response.data;
};

export const updateProceso = async (id, proceso) => {
    try {
        const response = await api.put(`/procesos/${id}`, proceso);
        return response.data;
    } catch (error) {
        // Propagar el mensaje de error del backend
        throw error.response?.data || error;
    }
};

export const deleteProceso = async (id) => {
    const response = await api.delete(`/procesos/${id}`);
    return response.data;
}; 