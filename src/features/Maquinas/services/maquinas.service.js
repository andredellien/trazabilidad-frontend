import api from "../../../shared/services/api";

export const getAllMaquinas = async () => {
    const response = await api.get("/maquinas");
    return response.data;
};

export const getMaquinaById = async (id) => {
    const response = await api.get(`/maquinas/${id}`);
    return response.data;
};

export const createMaquina = async (maquina) => {
    const response = await api.post("/maquinas", maquina);
    return response.data;
};

export const updateMaquina = async (id, maquina) => {
    const response = await api.put(`/maquinas/${id}`, maquina);
    return response.data;
};

export const deleteMaquina = async (id) => {
    const response = await api.delete(`/maquinas/${id}`);
    return response.data;
};

export const uploadMaquinaImage = async (imagen) => {
    const formData = new FormData();
    formData.append('imagen', imagen);
    const response = await api.post("/maquinas/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}; 