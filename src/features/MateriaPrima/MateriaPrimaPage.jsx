import React from "react";
import MateriaPrimaForm from "./Components/MateriaPrimaForm";
import MateriaPrimaList from "./Components/MateriaPrimaList";

const MateriaPrimaPage = () => {
	return (
		<div className="materia-container">
			<h1>Recepción de Materia Prima</h1>
			<MateriaPrimaForm />
			<h1>Listado de Materias Prima creeadas</h1>
			<MateriaPrimaList></MateriaPrimaList>
		</div>
	);
};

export default MateriaPrimaPage;
