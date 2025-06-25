import api from '../../../shared/services/api';

export async function getAllVariablesEstandar() {
  return api.get('/variable-estandar').then(res => res.data);
}

export async function getVariableEstandarById(id) {
  return api.get(`/variable-estandar/${id}`).then(res => res.data);
}

export async function createVariableEstandar(data) {
  return api.post('/variable-estandar', data).then(res => res.data);
}

export async function updateVariableEstandar(id, data) {
  return api.put(`/variable-estandar/${id}`, data).then(res => res.data);
}

export async function deleteVariableEstandar(id) {
  return api.delete(`/variable-estandar/${id}`).then(res => res.data);
} 