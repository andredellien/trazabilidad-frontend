import useLotes from "../hooks/useLotes";

/**
 * Tabla de lotes con materias primas y cantidades
 */
export default function LoteList() {
	const { data: lotes, loading, error } = useLotes();

	if (loading) return <p>Cargando lotes…</p>;
	if (error) return <p className="mp-error">{error}</p>;

	return (
		<div className="mp-table-wrapper">
			<table className="mp-table">
				<thead>
					<tr>
						<th>ID Lote</th>
						<th>Nombre</th>
						<th>Materias primas</th>
						<th>Fecha creación</th>
						<th>Estado</th>
					</tr>
				</thead>
				<tbody>
					{lotes.map((l) => (
						<tr key={l.IdLote}>
							<td>{l.IdLote}</td>
							<td>{l.Nombre}</td>
							<td>
								<ul className="mp-inline-list">
									{l.MateriasPrimas.map((mp) => (
										<li key={mp.IdMateriaPrima}>
											{mp.Nombre} <strong>({mp.Cantidad})</strong>
										</li>
									))}
								</ul>
							</td>
							<td>{new Date(l.FechaCreacion).toLocaleDateString()}</td>
							<td>{l.Estado}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
