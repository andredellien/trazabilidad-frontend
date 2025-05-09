import React from "react";

function MaquinaCard({ maquina, completada, bloqueada, onClick }) {
	return (
		<div
			className={`border rounded-lg shadow p-2 m-2 w-[150px] text-center cursor-pointer
      ${bloqueada ? "opacity-30 pointer-events-none" : ""}
      ${completada ? "bg-green-100 border-green-400" : "bg-white"}`}
			onClick={onClick}
		>
			<img
				src={maquina.imagen}
				alt={maquina.nombre}
				className="h-24 w-full object-cover rounded"
			/>
			<h3 className="mt-2 font-semibold">{maquina.nombre}</h3>
			{completada && <span className="text-green-600">✅</span>}
		</div>
	);
}

export default MaquinaCard;
