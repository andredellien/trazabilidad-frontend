import api from "../../../shared/services/api";

// Simulación de servicio. Aquí iría tu llamada real a la API
const registrar = async ({ nombre, correo, contrasena, cargo }) => {
  try {
    const response = await api.post("/auth/register", {
      Nombre: nombre,
      Usuario: correo,
      Password: contrasena,
      Cargo: cargo
    });
    return { ok: true, data: response.data };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { ok: false, error: error.response?.data?.message || "Error en el registro" };
  }
};

export default {
  registrar,
};
  