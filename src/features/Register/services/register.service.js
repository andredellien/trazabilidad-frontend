// Simulación de servicio. Aquí iría tu llamada real a la API
const registrar = async ({ nombre, correo, contrasena }) => {
    console.log("Registrando usuario:", { nombre, correo });
    // Simulación de llamada exitosa
    await new Promise((res) => setTimeout(res, 1000));
    return { ok: true };
  };
  
  export default {
    registrar,
  };
  