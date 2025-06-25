import { useState } from "react";
import useCreateMateriaPrima from "../hooks/useCreateMateriaPrima";
import usePedidosPendientes from "../hooks/usePedidosPendientes";

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
		<div className="mp-form-wrapper">
			<div className="mp-form-card">
				<h2 className="mp-heading">Registrar Materia Prima</h2>

				<form onSubmit={handleSubmit} className="mp-form">
					<div className="mp-field">
						<label htmlFor="Nombre" className="mp-label">
							Nombre *
						</label>
						<input
							id="Nombre"
							name="Nombre"
							type="text"
							placeholder="Harina de trigo 000"
							value={form.Nombre}
							onChange={handleChange}
							required
							className="mp-input"
						/>
					</div>

					<div className="mp-row">
						<div className="mp-field">
							<label htmlFor="FechaRecepcion" className="mp-label">
								Fecha de recepción *
							</label>
							<input
								id="FechaRecepcion"
								name="FechaRecepcion"
								type="date"
								value={form.FechaRecepcion}
								onChange={handleChange}
								required
								className="mp-input"
							/>
						</div>
						<div className="mp-field">
							<label htmlFor="Cantidad" className="mp-label">
								Cantidad (kg) *
							</label>
							<input
								id="Cantidad"
								name="Cantidad"
								type="number"
								step="0.01"
								placeholder="100.50"
								value={form.Cantidad}
								onChange={handleChange}
								required
								className="mp-input"
							/>
						</div>
					</div>

					<div className="mp-field">
						<label htmlFor="Proveedor" className="mp-label">
							Proveedor
						</label>
						<input
							id="Proveedor"
							name="Proveedor"
							type="text"
							placeholder="Molinos SRL"
							value={form.Proveedor}
							onChange={handleChange}
							className="mp-input"
						/>
					</div>

					<div className="mp-field">
						<label htmlFor="IdPedido" className="mp-label">
							Pedido *
						</label>
						<select
							id="IdPedido"
							name="IdPedido"
							value={form.IdPedido}
							onChange={handleChange}
							required
							className="mp-input"
							disabled={loadingPedidos}
						>
							<option value="">Seleccionar pedido disponible</option>
							{pedidos.map((pedido) => (
								<option key={pedido.IdPedido} value={pedido.IdPedido}>
									Pedido #{pedido.IdPedido} - {pedido.Descripcion || "Sin descripción"} ({pedido.Estado})
								</option>
							))}
						</select>
						{loadingPedidos && <small className="mp-help">Cargando pedidos...</small>}
						{errorPedidos && <small className="mp-error">{errorPedidos}</small>}
					</div>

					{error && <p className="mp-error">{error}</p>}
					{success && (
						<p className="mp-success">
							Materia prima registrada correctamente.
						</p>
					)}

					<button type="submit" disabled={loading} className="mp-button">
						{loading ? "Registrando…" : "Registrar"}
					</button>
				</form>
			</div>
		</div>
	);
}
