import registerService from "../services/register.service";

const useRegister = () => {
  const registrarUsuario = async ({ nombre, correo, contrasena }) => {
    try {
      const res = await registerService.registrar({ nombre, correo, contrasena });
      return res.ok;
    } catch (err) {
      console.error("Error en el registro:", err);
      return false;
    }
  };

  return {
    registrarUsuario,
  };
};

export default useRegister;
