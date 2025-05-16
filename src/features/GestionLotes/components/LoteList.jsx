/**
 * Tabla de lotes con materias primas y cantidades
 */
export default function LoteList({ lotes, loading, error }) {
	if (loading) return <p>Cargando lotes…</p>;
	if (error) return <p className="mp-error">{error}</p>;

	if (!lotes || lotes.length === 0) return <p>No hay lotes registrados.</p>;

	const getEstadoBadge = (estado) => {
		switch (estado.toLowerCase()) {
			case "certificado":
				return (
					<span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 border border-green-300 rounded-full">
						✅ Certificado
					</span>
				);
			case "pendiente":
				return (
					<span className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-full">
						⚠️ Pendiente
					</span>
				);
			case "no certificado":
				return (
					<span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 border border-red-300 rounded-full">
						❌ No Certificado
					</span>
				);
			default:
				return estado;
		}
	};

	return (
		<div className="mp-table-wrapper">
			<table className="mp-table w-full text-left border-collapse">
				<thead>
					<tr className="bg-gray-100">
						<th className="p-2">ID Lote</th>
						<th className="p-2">Nombre</th>
						<th className="p-2">Materias primas</th>
						<th className="p-2">Fecha creación</th>
						<th className="p-2">Estado</th>
					</tr>
				</thead>
				<tbody>
					{lotes.map((l) => (
						<tr key={l.IdLote} className="border-b hover:bg-gray-50">
							<td className="p-2">{l.IdLote}</td>
							<td className="p-2">{l.Nombre}</td>
							<td className="p-2">
								<ul className="space-y-1">
									{l.MateriasPrimas.map((mp) => (
										<li key={mp.IdMateriaPrima}>
											{mp.Nombre} <strong>({mp.Cantidad})</strong>
										</li>
									))}
								</ul>
							</td>
							<td className="p-2">
								{new Date(l.FechaCreacion).toLocaleDateString()}
							</td>
							<td className="p-2">{getEstadoBadge(l.Estado)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
