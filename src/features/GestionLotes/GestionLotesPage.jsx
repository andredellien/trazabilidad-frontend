import LoteForm from "./components/LoteForm";
import LoteList from "./components/LoteList";

export default function LotePage() {
	return (
		<section className="materia-container">
			<h1>Gestion de Lotes</h1>
			<LoteForm />
			<div style={{ marginTop: 40 }} />
			<LoteList />
		</section>
	);
}
