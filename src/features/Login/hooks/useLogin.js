import loginService from "../services/login.service";

const useLogin = () => {
  const iniciarSesion = async (correo, contrasena) => {
    try {
      const res = await loginService.login({ correo, contrasena });
      return res.ok;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  return {
    iniciarSesion,
  };
};

export default useLogin;
