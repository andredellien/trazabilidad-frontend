import codigoQRService from "../services/codigoQR.service";
import { useState } from "react";

const useCodigoQR = () => {
  const [codigos, setCodigos] = useState([]);
  const [lotesSinQR, setLotesSinQR] = useState(["Lote #12348", "Lote #12349"]);

  const obtenerCodigos = async () => {
    const data = await codigoQRService.getTodos();
    setCodigos(data);
  };

  const generarCodigoQR = async (lote) => {
    const resultado = await codigoQRService.generarQR(lote);
    if (resultado.ok) {
      setCodigos((prev) => [...prev, resultado.dato]);
      setLotesSinQR((prev) => prev.filter(l => l !== lote));
    }
    return resultado.ok;
  };

  return {
    codigos,
    lotesSinQR,
    obtenerCodigos,
    generarCodigoQR,
  };
};

export default useCodigoQR;
