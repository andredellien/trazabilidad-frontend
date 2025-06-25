import api from '../../../shared/services/api';

export const getAllPedidos = async () => {
    const response = await api.get('/pedido');
    return response.data;
};

export const getPedidoById = async (id) => {
    const response = await api.get(`/pedido/${id}`);
    return response.data;
};

export const createPedido = async (pedido) => {
    const response = await api.post('/pedido', pedido);
    return response.data;
};

export const updatePedido = async (id, pedido) => {
    const response = await api.put(`/pedido/${id}`, pedido);
    return response.data;
};

export const deletePedido = async (id) => {
    const response = await api.delete(`/pedido/${id}`);
    return response.data;
}; 