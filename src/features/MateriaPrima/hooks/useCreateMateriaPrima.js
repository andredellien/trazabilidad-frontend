import { useState } from "react";
import { createMateriaPrima } from "../services/materiaPrima.service";

export default function useCreateMateriaPrima() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	async function handleCreate(formData) {
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			// Asegurarse de que todos los campos requeridos estén presentes
			const materiaPrimaData = {
				Nombre: formData.Nombre,
				FechaRecepcion: formData.FechaRecepcion || new Date().toISOString().split('T')[0],
				Proveedor: formData.Proveedor,
				Cantidad: parseFloat(formData.Cantidad),
				Unidad: formData.Unidad || 'kg',
				Estado: formData.Estado || 'solicitado',
				IdProveedor: parseInt(formData.IdProveedor),
				IdPedido: parseInt(formData.IdPedido)
			};

			await createMateriaPrima(materiaPrimaData);
			setSuccess(true);
			// Disparar evento personalizado para notificar la creación
			window.dispatchEvent(new CustomEvent('materiaPrimaCreated'));
		} catch (err) {
			console.error('Error al crear materia prima:', err);
			setError(err.response?.data?.message || 'Error al crear la materia prima');
		} finally {
			setLoading(false);
		}
	}
	return { handleCreate, loading, error, success };
}
