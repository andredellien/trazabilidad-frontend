import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRegister";
import "../styles/Register.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    cargo: "operador" // Valor por defecto
  });

  const [error, setError] = useState("");
  const { registrarUsuario } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, correo, contrasena, confirmarContrasena, cargo } = formData;

    if (!nombre || !correo || !contrasena || !confirmarContrasena || !cargo) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const exito = await registrarUsuario({ nombre, correo, contrasena, cargo });
    if (exito) {
      navigate("/login");
    } else {
      setError("Error al registrar. Intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          placeholder="Ingresa tu nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Correo Electrónico</label>
        <input
          type="email"
          name="correo"
          placeholder="Ingresa tu dirección de correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Cargo</label>
        <select
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          required
        >
          <option value="operador">Operador</option>
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasena"
          placeholder="Crea una contraseña"
          value={formData.contrasena}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmarContrasena"
          placeholder="Confirma tu contraseña"
          value={formData.confirmarContrasena}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">Crear Cuenta</button>
    </form>
  );
};

export default RegisterForm;
