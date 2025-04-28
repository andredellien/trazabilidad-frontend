import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginForm = () => {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { iniciarSesion } = useLogin();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { correo, contrasena } = formData;

    if (!correo || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const exito = await iniciarSesion(correo, contrasena);
    if (exito) {
      navigate("/Dashboard");
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Correo electrónico</label>
        <input
          type="email"
          name="correo"
          placeholder="Ingresa tu correo electrónico"
          value={formData.correo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasena"
          placeholder="Ingresa tu contraseña"
          value={formData.contrasena}
          onChange={handleChange}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default LoginForm;
