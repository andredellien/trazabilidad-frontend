import api from "../../../shared/services/api";

export const getAlmacenajesByLote = async (idLote) => {
  const res = await api.get(`/almacenaje/lote/${idLote}`);
  return res.data;
};

export const createAlmacenaje = async (data) => {
  const res = await api.post('/almacenaje', data);
  return res.data;
};

export const getAllAlmacenajes = async () => {
  const res = await api.get('/almacenaje');
  return res.data;
}; 