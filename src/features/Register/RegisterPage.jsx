import React from "react";
import RegisterForm from "./components/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <h1>Crea Tu Cuenta</h1>
      <p>Completa tus datos para comenzar</p>
      <RegisterForm />
      <p style={{ marginTop: "1rem" }}>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
