import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
	Alert,
	Container,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StandardList, ModalForm } from "../../shared/components";
import useVariablesEstandar from "./hooks/useVariablesEstandar";

export default function VariablesEstandarPage() {
	const {
		variables,
		loading,
		error,
		fetchVariables,
		createVariableEstandar,
		updateVariableEstandar,
		deleteVariableEstandar,
	} = useVariablesEstandar();

	const [modalOpen, setModalOpen] = useState(false);
	const [editData, setEditData] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [actionError, setActionError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		fetchVariables();
	}, [fetchVariables]);

	const handleOpenNew = () => {
		setEditData(null);
		setModalOpen(true);
		setActionError("");
		setSuccess("");
	};

	const handleOpenEdit = (variable) => {
		setEditData(variable);
		setModalOpen(true);
		setActionError("");
		setSuccess("");
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setEditData(null);
		setActionError("");
		setSuccess("");
	};

	const handleSubmit = async (formData) => {
		setActionLoading(true);
		setActionError("");
		setSuccess("");

		try {
			if (editData) {
				await updateVariableEstandar(editData.IdVariableEstandar, formData);
				setSuccess("Variable estándar actualizada exitosamente");
			} else {
				await createVariableEstandar(formData);
				setSuccess("Variable estándar creada exitosamente");
			}

			setTimeout(() => {
				setSuccess("");
				handleCloseModal();
				fetchVariables(); // Refrescar la lista
			}, 2000);
		} catch (err) {
			setActionError(
				err.response?.data?.message || "Error al guardar la variable estándar"
			);
		} finally {
			setActionLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setActionLoading(true);
		setActionError("");
		try {
			await deleteVariableEstandar(id);
			setDeleteId(null);
		} catch (err) {
			setActionError(err.response?.data?.message || "Error al eliminar");
		} finally {
			setActionLoading(false);
		}
	};

	const validateForm = (formData) => {
		const errors = {};
		if (!formData.Nombre?.trim()) {
			errors.Nombre = "El nombre es obligatorio";
		}
		return errors;
	};

	const fields = [
		{
			name: "Nombre",
			label: "Nombre",
			type: "text",
			required: true,
			autoFocus: true,
		},
		{
			name: "Unidad",
			label: "Unidad",
			type: "text",
		},
		{
			name: "Descripcion",
			label: "Descripción",
			type: "textarea",
			rows: 3,
		},
	];

	// Configuración de columnas para StandardList
	const columns = [
		{ key: "Nombre", label: "Nombre", align: "left" },
		{ key: "Unidad", label: "Unidad", align: "center" },
		{ key: "Descripcion", label: "Descripción", align: "left" },
		{ key: "actions", label: "Acciones", align: "center", type: "actions" },
	];

	// Configuración de acciones
	const actions = [
		{
			type: "edit",
			tooltip: "Editar variable estándar",
			label: "Editar",
		},
		{
			type: "delete",
			tooltip: "Eliminar variable estándar",
			label: "Eliminar",
		},
	];

	// Manejar acciones
	const handleAction = (actionType, row) => {
		if (actionType === "edit") {
			handleOpenEdit(row);
		} else if (actionType === "delete") {
			setDeleteId(row.IdVariableEstandar);
		}
	};

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
				<Box sx={{ textAlign: { xs: "center", md: "left" } }}>
					<Typography variant="h4" fontWeight={600}>
						Variables Estándar
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
						Administre las variables estándar que luego podrá seleccionar al
						crear procesos
					</Typography>
				</Box>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleOpenNew}
					size="small"
					sx={{ width: { xs: "100%", md: "auto" } }}
				>
					Nueva Variable
				</Button>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			{actionError && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{actionError}
				</Alert>
			)}

			<StandardList
				data={variables}
				columns={columns}
				actions={actions}
				loading={loading}
				error={error}
				title=""
				emptyMessage="No hay variables registradas"
				onAction={handleAction}
				showSearch={false}
				sx={{
					width: "100%",
					p: { xs: 1, md: 3 },
					boxShadow: 3,
					borderRadius: 2,
					bgcolor: "background.paper",
					overflowX: "auto",
				}}
			/>

			{/* ModalForm para crear/editar variables */}
			<ModalForm
				isOpen={modalOpen}
				onClose={handleCloseModal}
				title={
					editData ? "Editar Variable Estándar" : "Nueva Variable Estándar"
				}
				fields={fields}
				onSubmit={handleSubmit}
				loading={actionLoading}
				error={actionError}
				success={success}
				initialValues={editData || { Nombre: "", Unidad: "", Descripcion: "" }}
				validate={validateForm}
				submitButtonText={editData ? "Actualizar" : "Crear"}
				maxWidth="sm"
			/>

			{/* Dialogo de confirmación de borrado */}
			<Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
				<DialogTitle>¿Eliminar variable estándar?</DialogTitle>
				<DialogContent>
					<Typography>
						Esta acción desactivará la variable estándar y no podrá ser
						seleccionada en nuevos procesos.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteId(null)}>Cancelar</Button>
					<Button
						onClick={() => handleDelete(deleteId)}
						color="error"
						variant="contained"
						disabled={actionLoading}
					>
						{actionLoading ? <CircularProgress size={20} /> : "Eliminar"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}
