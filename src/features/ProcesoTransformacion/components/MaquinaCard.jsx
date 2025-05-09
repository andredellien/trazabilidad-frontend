import React from "react";
import { Lock, CheckCircle, Clock } from "lucide-react";

function MaquinaCard({ maquina, completada, bloqueada, onClick }) {
	let estadoIcono;
	let estadoColor = "";

	if (completada) {
		estadoIcono = <CheckCircle className="text-[#007c64] w-5 h-5" />;
		estadoColor = "border-[#007c64]";
	} else if (bloqueada) {
		estadoIcono = <Lock className="text-gray-400 w-5 h-5" />;
		estadoColor = "border-gray-300 opacity-50 pointer-events-none";
	} else {
		estadoIcono = <Clock className="text-yellow-500 w-5 h-5" />;
		estadoColor = "border-yellow-400";
	}

	return (
		<div
			onClick={onClick}
			className={`bg-white rounded-xl shadow hover:shadow-md transition-all border-2 ${estadoColor} cursor-pointer p-4 flex flex-col items-center`}
		>
			<div className="h-32 w-full flex items-center justify-center mb-3">
				<img
					src={maquina.imagen}
					alt={maquina.nombre}
					className="max-h-full max-w-full object-contain"
				/>
			</div>
			<h3 className="text-lg font-semibold text-center text-gray-800">
				{maquina.nombre}
			</h3>
			<div className="mt-2">{estadoIcono}</div>
		</div>
	);
}

export default MaquinaCard;
