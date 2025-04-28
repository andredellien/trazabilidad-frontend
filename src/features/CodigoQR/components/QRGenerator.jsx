import React, { useEffect, useState } from "react";
import useCodigoQR from "../hooks/useCodigoQR";

const QRGenerator = () => {
  const [filtro, setFiltro] = useState("Todos");
  const [selectedLote, setSelectedLote] = useState("");

  const {
    codigos,
    lotesSinQR,
    obtenerCodigos,
    generarCodigoQR,
  } = useCodigoQR();

  useEffect(() => {
    obtenerCodigos();
  }, []);

  const handleGenerar = async () => {
    if (!selectedLote) return;
    const ok = await generarCodigoQR(selectedLote);
    if (ok) {
      alert(`Código QR generado para ${selectedLote}`);
      setSelectedLote("");
    } else {
      alert("Ocurrió un error al generar el QR");
    }
  };

  const filtrarCodigos = () => {
    if (filtro === "Recientes") return codigos.slice(-1);
    if (filtro === "Archivados") return codigos.filter(qr => qr.estado === "Completado");
    return codigos;
  };

  return (
    <>
      <div className="qr-generador-box">
        <h3>Seleccionar Lote</h3>
        <p>Elija un lote de la lista para generar un código QR asociado</p>
        <button className="btn-registrar" onClick={handleGenerar} disabled={!selectedLote}>
          Generar Código QR
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <label>Lotes sin código QR</label>
        <select value={selectedLote} onChange={(e) => setSelectedLote(e.target.value)}>
          <option value="">Seleccione un lote</option>
          {lotesSinQR.map((lote, idx) => (
            <option key={idx} value={lote}>{lote}</option>
          ))}
        </select>
      </div>

      <h2>Códigos QR Generados</h2>
      <div className="qr-tabs">
        {["Todos", "Recientes", "Archivados"].map(tab => (
          <button
            key={tab}
            className={`qr-tab ${filtro === tab ? "active" : ""}`}
            onClick={() => setFiltro(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Lote</th>
            <th>Producto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrarCodigos().map((qr, idx) => (
            <tr key={idx}>
              <td>{qr.lote}</td>
              <td>{qr.producto}</td>
              <td>{qr.fecha}</td>
              <td>{qr.estado}</td>
              <td>
                <button title="Ver">👁️</button>
                <button title="Descargar" style={{ marginLeft: "0.5rem" }}>⬇️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default QRGenerator;
