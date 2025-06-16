import { useState } from "react";
import useCreateLote from "../hooks/useCreateLote";
import useMateriasPrimas from "../../MateriaPrima/hooks/useMateriasPrimas";

export default function LoteForm({ onCreated }) {
	const [form, setForm] = useState({
		Nombre: "",
		MateriasPrimas: [],
	});

	const { handleCreate, loading, error, success } = useCreateLote();
	const { data: materiasPrimas, loading: loadingMaterias } =
		useMateriasPrimas();

	const onChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const onCantidadChange = (id, cantidad) => {
		const actualizado = form.MateriasPrimas.map((m) =>
			m.IdMateriaPrima === id ? { ...m, Cantidad: cantidad } : m
		);
		setForm({ ...form, MateriasPrimas: actualizado });
	};

	const onAgregarMateria = (e) => {
		const id = parseInt(e.target.value, 10);
		if (!id || form.MateriasPrimas.some((m) => m.IdMateriaPrima === id)) return;
		const nueva = { IdMateriaPrima: id, Cantidad: 1 };
		setForm({
			...form,
			MateriasPrimas: [...form.MateriasPrimas, nueva],
		});
	};

	const onEliminarMateria = (id) => {
		const actualizado = form.MateriasPrimas.filter(
			(mp) => mp.IdMateriaPrima !== id
		);
		setForm({ ...form, MateriasPrimas: actualizado });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const formData = {
			...form,
			FechaCreacion: new Date().toISOString().split('T')[0],
			Estado: "Pendiente"
		};
		await handleCreate(formData);
		if (!error) {
			setForm({
				Nombre: "",
				MateriasPrimas: [],
			});
			if (typeof onCreated === "function") onCreated();
		}
	};

	return (
		<div
			className="mp-form-card"
			style={{ maxWidth: "840px", margin: "40px auto" }}
		>
			<h2 className="mp-heading">Crear Lote</h2>

			<form onSubmit={onSubmit} className="mp-form">
				<div className="mp-field">
					<label className="mp-label" htmlFor="Nombre">
						Nombre *
					</label>
					<input
						id="Nombre"
						name="Nombre"
						value={form.Nombre}
						onChange={onChange}
						required
						className="mp-input"
					/>
				</div>

				<div className="mp-field">
					<label className="mp-label" htmlFor="materiaPrima">
						Agregar materia prima
					</label>
					<select
						id="materiaPrima"
						aria-label="Agregar materia prima"
						onChange={onAgregarMateria}
						disabled={loadingMaterias}
						className="mp-input"
					>
						<option value="">Seleccionar</option>
						{materiasPrimas.map((m) => (
							<option key={m.IdMateriaPrima} value={m.IdMateriaPrima}>
								{m.Nombre}
							</option>
						))}
					</select>
				</div>

				{form.MateriasPrimas.map((mp) => {
					const materia = materiasPrimas.find(
						(m) => m.IdMateriaPrima === mp.IdMateriaPrima
					);
					return (
						<div
							className="mp-field"
							key={mp.IdMateriaPrima}
							style={{
								display: "flex",
								gap: "0.5rem",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<div className="mp-label-s">
								<label className="mp-label">
									{materia?.Nombre || "Materia Desconocida"}
								</label>
								<div className="quantity-label">
									Disponible: {materia?.Cantidad}
								</div>
							</div>

							<div style={{ display: "flex", gap: "20px" }}>
								<input
									type="number"
									min="0"
									step="0.01"
									placeholder="Cantidad"
									value={mp.Cantidad}
									onChange={(e) =>
										onCantidadChange(
											mp.IdMateriaPrima,
											parseFloat(e.target.value)
										)
									}
									required
									className="mp-input"
									style={{ width: "90px" }}
								/>
								<button
									type="button"
									onClick={() => onEliminarMateria(mp.IdMateriaPrima)}
									className="mp-button"
									style={{
										backgroundColor: "#d9534f",
										color: "white",
										padding: "0.3rem 0.6rem",
										fontSize: "0.75rem",
										width: "30px",
									}}
								>
									✕
								</button>
							</div>
						</div>
					);
				})}

				{error && <p className="mp-error">{error}</p>}
				{success && <p className="mp-success">Lote creado correctamente.</p>}

				<button className="mp-button" disabled={loading}>
					{loading ? "Creando…" : "Crear lote"}
				</button>
			</form>
		</div>
	);
}
