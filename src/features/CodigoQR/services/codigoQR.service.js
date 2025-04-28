const datosQRMock = [
    { lote: "Lote #12345", producto: "Producto A", fecha: "12/05/2023", estado: "Activo" },
    { lote: "Lote #12346", producto: "Producto B", fecha: "14/05/2023", estado: "Activo" },
    { lote: "Lote #12347", producto: "Producto C", fecha: "15/05/2023", estado: "Completado" },
  ];
  
  const getTodos = async () => {
    await new Promise((res) => setTimeout(res, 500)); // Simula delay
    return datosQRMock;
  };
  
  const generarQR = async (lote) => {
    const nuevo = {
      lote: lote,
      producto: "Producto Generado",
      fecha: new Date().toLocaleDateString("es-ES"),
      estado: "Activo",
    };
  
    await new Promise((res) => setTimeout(res, 500));
    return { ok: true, dato: nuevo };
  };
  
  export default {
    getTodos,
    generarQR,
  };
  