import React, { useState } from "react";
import MateriaPrimaBaseList from "./Components/MateriaPrimaBaseList";
import { Box, Container, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { ModalForm } from "../../shared/components";
import {
	createMateriaPrimaBase,
	getAllMateriaPrimaBase,
	updateMateriaPrimaBase,
} from "./services/materiaPrima.service";
import MateriaPrimaBaseLogModal from "./Components/MateriaPrimaBaseLogModal";

export default function MateriaPrimaBasePage() {
	const [refresh, setRefresh] = useState(0);
	const [logOpen, setLogOpen] = useState(false);
	const [selectedBase, setSelectedBase] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleCreated = () => setRefresh((r) => r + 1);
	const handleShowLog = (base) => {
		setSelectedBase(base);
		setLogOpen(true);
	};
	const handleCloseLog = () => {
		setLogOpen(false);
		setSelectedBase(null);
	};

	const handleOpenModal = () => {
		setModalOpen(true);
		setError("");
		setSuccess("");
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setError("");
		setSuccess("");
	};

	const handleSubmit = async (formData) => {
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// Verificar si ya existe una materia prima base con el mismo nombre
			const materiasPrimasBaseExistentes = await getAllMateriaPrimaBase();
			const materiaPrimaBaseExistente = materiasPrimasBaseExistentes.find(
				(mp) => mp.Nombre.toLowerCase() === formData.nombre.toLowerCase().trim()
			);

			if (materiaPrimaBaseExistente) {
				// Si existe, actualizar la cantidad
				const nuevaCantidad =
					materiaPrimaBaseExistente.Cantidad + formData.cantidad;
				await updateMateriaPrimaBase(
					materiaPrimaBaseExistente.IdMateriaPrimaBase,
					{
						Nombre: materiaPrimaBaseExistente.Nombre,
						Unidad: materiaPrimaBaseExistente.Unidad,
						Cantidad: nuevaCantidad,
					}
				);
				setSuccess(
					`Cantidad actualizada exitosamente. Total: ${nuevaCantidad} ${formData.unidad}`
				);
				setTimeout(() => {
					setSuccess("");
					handleCloseModal();
					handleCreated();
				}, 2000);
			} else {
				// Si no existe, crear nueva materia prima base
				await createMateriaPrimaBase({
					Nombre: formData.nombre.trim(),
					Unidad: formData.unidad,
					Cantidad: formData.cantidad,
				});
				setSuccess("Materia prima base creada exitosamente");
				setTimeout(() => {
					setSuccess("");
					handleCloseModal();
					handleCreated();
				}, 2000);
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Error al procesar materia prima base"
			);
		} finally {
			setLoading(false);
		}
	};

	const validateForm = (formData) => {
		const errors = {};
		if (!formData.nombre?.trim()) {
			errors.nombre = "El nombre es obligatorio";
		}
		if (!formData.unidad) {
			errors.unidad = "La unidad es obligatoria";
		}
		if (formData.cantidad <= 0) {
			errors.cantidad = "La cantidad debe ser mayor a 0";
		}
		return errors;
	};

	const fields = [
		{
			name: "nombre",
			label: "Nombre",
			type: "text",
			required: true,
			autoFocus: true,
		},
		{
			name: "unidad",
			label: "Unidad",
			type: "select",
			required: true,
			options: [
				{ value: "kg", label: "Kilogramos (kg)" },
				{ value: "lts", label: "Litros (lts)" },
				{ value: "g", label: "Gramos (g)" },
				{ value: "ml", label: "Mililitros (ml)" },
				{ value: "unid", label: "Unidades" },
			],
		},
		{
			name: "cantidad",
			label: "Cantidad inicial",
			type: "number",
			required: true,
			min: 0,
			step: 0.01,
		},
	];

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box
				sx={{
					mb: 3,
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					justifyContent: { xs: "center", md: "space-between" },
					alignItems: { xs: "center", md: "center" },
					gap: 2,
				}}
			>
				<Typography
					variant="h4"
					fontWeight={600}
					sx={{ textAlign: { xs: "center", md: "left" } }}
				>
					Gestión de Materias Primas Base
				</Typography>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleOpenModal}
					size="small"
					sx={{ width: { xs: "100%", md: "auto" } }}
				>
					Crear Materia Prima
				</Button>
			</Box>

			<MateriaPrimaBaseList refresh={refresh} onShowLog={handleShowLog} />

			<ModalForm
				isOpen={modalOpen}
				onClose={handleCloseModal}
				title="Crear Materia Prima Base"
				fields={fields}
				onSubmit={handleSubmit}
				loading={loading}
				error={error}
				success={success}
				initialValues={{ nombre: "", unidad: "kg", cantidad: 0 }}
				validate={validateForm}
				submitButtonText="Crear"
				maxWidth="sm"
			/>

			<MateriaPrimaBaseLogModal
				open={logOpen}
				onClose={handleCloseLog}
				materiaPrimaBase={selectedBase}
			/>
		</Container>
	);
}
