import { useState } from "react";
import useCreateMateriaPrima from "../hooks/useCreateMateriaPrima";
import usePedidosPendientes from "../hooks/usePedidosPendientes";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Card from "../../../shared/components/Card";

/**
 * Formulario de registro de Materia Prima (sin Tailwind)
 * Usa clases CSS vanilla — agrega los estilos en tu hoja global o módulo CSS.
 */
export default function MateriaPrimaForm({ onCreated }) {
	const [form, setForm] = useState({
		Nombre: "",
		FechaRecepcion: "",
		Proveedor: "",
		Cantidad: "",
		IdPedido: "",
	});

	const { handleCreate, loading, error, success } = useCreateMateriaPrima();
	const { pedidos, loading: loadingPedidos, error: errorPedidos } = usePedidosPendientes();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		await handleCreate({ ...form, Cantidad: parseFloat(form.Cantidad) });
		if (!error) {
			setForm({ Nombre: "", FechaRecepcion: "", Proveedor: "", Cantidad: "", IdPedido:"" });
			if (typeof onCreated === "function") onCreated(); // recarga la lista
		}
	};

	return (
		<Card title="Registrar Materia Prima" className="max-w-2xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					id="Nombre"
					name="Nombre"
					label="Nombre *"
					type="text"
					placeholder="Harina de trigo 000"
					value={form.Nombre}
					onChange={handleChange}
					required
				/>

				<div className="flex gap-4">
					<div className="flex-1">
						<Input
							id="FechaRecepcion"
							name="FechaRecepcion"
							label="Fecha de recepción *"
							type="date"
							value={form.FechaRecepcion}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="flex-1">
						<Input
							id="Cantidad"
							name="Cantidad"
							label="Cantidad (kg) *"
							type="number"
							step="0.01"
							placeholder="100.50"
							value={form.Cantidad}
							onChange={handleChange}
							required
						/>
					</div>
				</div>

				<Input
					id="Proveedor"
					name="Proveedor"
					label="Proveedor"
					type="text"
					placeholder="Molinos SRL"
					value={form.Proveedor}
					onChange={handleChange}
				/>

				<Select
					id="IdPedido"
					name="IdPedido"
					label="Pedido *"
					value={form.IdPedido}
					onChange={handleChange}
					required
					disabled={loadingPedidos}
					placeholder="Seleccionar pedido disponible"
					options={pedidos.map((pedido) => ({
						value: pedido.IdPedido,
						label: `Pedido #${pedido.IdPedido} - ${pedido.Descripcion || "Sin descripción"} (${pedido.Estado})`
					}))}
					help={loadingPedidos ? "Cargando pedidos..." : undefined}
					error={errorPedidos}
				/>

				{error && <Alert type="error">{error}</Alert>}
				{success && <Alert type="success">Materia prima registrada correctamente.</Alert>}

				<Button 
					type="submit" 
					disabled={loading} 
					loading={loading}
					fullWidth
					size="lg"
				>
					{loading ? "Registrando…" : "Registrar"}
				</Button>
			</form>
		</Card>
	);
}
