import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function descargarCertificadoA4(id) {
	const elemento = document.getElementById(id);
	if (!elemento) return;

	try {
		const canvas = await html2canvas(elemento, {
			scale: 2,
			useCORS: true,
			allowTaint: false,
		});

		const imgData = canvas.toDataURL("image/jpeg", 1.0);
		const pdf = new jsPDF("p", "pt", "a4");

		const width = pdf.internal.pageSize.getWidth();
		const height = (canvas.height * width) / canvas.width;

		pdf.addImage(imgData, "JPEG", 0, 0, width, height);
		pdf.save("certificado.pdf");
	} catch (error) {
		console.error("Error al generar PDF:", error);
	}
}
