import React, { useState } from "react";
import QRGenerator from "./components/QRGenerator";

const CodigoQRPage = () => {
  return (
    <div className="materia-container">
      <h1>Gestión de Códigos QR</h1>
      <QRGenerator />
    </div>
  );
};

export default CodigoQRPage;
