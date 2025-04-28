const useDashboard = () => {
    const getLotesRecientes = () => {
      return [
        {
          id: "12345",
          producto: "Café Orgánico",
          fecha: "10/05/2023",
          estado: "Completado",
        },
      ];
    };
  
    return {
      getLotesRecientes,
    };
  };
  
  export default useDashboard;
  