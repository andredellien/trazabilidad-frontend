import api from "../../../shared/services/api";

export const getAllCertificados = async () => {
    const response = await api.get("/lote");
    return response.data.filter(lote => lote.Estado === "Certificado");
};

export const getCertificadoById = async (id) => {
    const response = await api.get(`/proceso-evaluacion/log/${id}`);
    return response.data;
};

export const generateCertificado = async (loteId) => {
    const response = await api.post(`/proceso-evaluacion/finalizar/${loteId}`);
    return response.data;
};

export const downloadCertificadoPDF = async (id) => {
    const response = await api.get(`/proceso-evaluacion/log/${id}`, {
        responseType: 'blob'
    });
    return response.data;
};

export const generateCertificadoQR = async (id) => {
    const response = await api.get(`/proceso-evaluacion/log/${id}`);
    return response.data;
}; 