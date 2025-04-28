import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [error, setError] = useState("");
  const { registrarUsuario } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, correo, contrasena, confirmarContrasena } = formData;

    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const exito = await registrarUsuario({ nombre, correo, contrasena });
    if (exito) {
      navigate("/login");
    } else {
      setError("Error al registrar. Intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ingresa tu nombre completo"
          value={formData.nombre}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Correo Electrónico</label>
        <input
          type="email"
          name="correo"
          placeholder="Ingresa tu dirección de correo"
          value={formData.correo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasena"
          placeholder="Crea una contraseña"
          value={formData.contrasena}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmarContrasena"
          placeholder="Confirma tu contraseña"
          value={formData.confirmarContrasena}
          onChange={handleChange}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Crear Cuenta</button>
    </form>
  );
};

export default RegisterForm;
