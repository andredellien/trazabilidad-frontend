import useMateriasPrimas from "../hooks/useMateriasPrimas";

export default function MateriaPrimaList() {
	const { data: materias, loading, error } = useMateriasPrimas();

	if (loading) return <p>Cargando materias primas…</p>;
	if (error) return <p className="mp-error">{error}</p>;

	if (!materias || materias.length === 0)
		return <p>No hay materias primas registradas.</p>;

	// Sort materials from newest to oldest
	const sortedMaterias = [...materias].sort((a, b) => 
		new Date(b.FechaRecepcion) - new Date(a.FechaRecepcion)
	);

	return (
		<div className="mp-table-wrapper">
			<table className="mp-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Nombre</th>
						<th>Fecha recepción</th>
						<th>Proveedor</th>
						<th className="right">Cantidad (kg)</th>
					</tr>
				</thead>
				<tbody>
					{sortedMaterias.map((m) => (
						<tr key={m.IdMateriaPrima}>
							<td>{m.IdMateriaPrima}</td>
							<td>{m.Nombre}</td>
							<td>{new Date(m.FechaRecepcion).toLocaleDateString()}</td>
							<td>{m.Proveedor || "—"}</td>
							<td className="right">{m.Cantidad}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
