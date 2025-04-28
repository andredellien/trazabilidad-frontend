import React from "react";
import LoginForm from "./components/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="auth-container">
      <h1>Pantalla de Inicio de Sesión</h1>
      <LoginForm />
      <p style={{ marginTop: "1rem" }}>
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default LoginPage;
