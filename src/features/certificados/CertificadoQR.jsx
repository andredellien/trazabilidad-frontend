import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../shared/components/BackButton";
import QRCode from "react-qr-code";

export default function CertificadoQR() {
	const { idLote } = useParams();
	const [urlCertificado, setUrlCertificado] = useState("");

	useEffect(() => {
		// En producción esto debería ser un enlace público al certificado
		const url = `${window.location.origin}/certificado/${idLote}`;
		setUrlCertificado(url);
	}, [idLote]);

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
			<BackButton label="Volver a Certificados" to="/Certificados" />
			<div className="bg-white flex flex-col justify-center items-center p-6 rounded-xl shadow max-w-md w-full text-center">
				<h2 className="text-xl font-bold mb-4 text-[#007c64]">
					Código QR del Certificado
				</h2>
				<p className="text-sm text-gray-500 mb-4">
					Escanea este código para ver el certificado del lote #{idLote}
				</p>
				<div style={{ height: "256px", width: "256px" }}>
					<QRCode value={urlCertificado} size={256} />
				</div>
				<p className="mt-4 text-xs text-gray-400 break-all">{urlCertificado}</p>
			</div>
		</div>
	);
}
