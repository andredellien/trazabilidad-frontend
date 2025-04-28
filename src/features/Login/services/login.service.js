const login = async ({ correo, contrasena }) => {
    console.log("Intentando login:", correo);
    // Simulación de autenticación exitosa
    if (correo === "admin@admin.com" && contrasena === "123456") {
      await new Promise((res) => setTimeout(res, 1000));
      return { ok: true };
    }
  
    return { ok: false };
  };
  
  export default {
    login,
  };
  