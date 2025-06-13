import api from "../../../shared/services/api";

const getTodos = async () => {
    const response = await api.get("/codigo-qr");
    return response.data;
};

const generarQR = async (lote) => {
    const response = await api.post("/codigo-qr", { lote });
    return { ok: true, dato: response.data };
};

export default {
    getTodos,
    generarQR,
};
  