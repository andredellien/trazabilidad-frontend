import { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import ProveedorForm from "./ProveedorForm";

export default function ProveedorList({ proveedores, onUpdate, onDelete, onCreate }) {
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (proveedor) => {
        setSelectedProveedor(proveedor);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedProveedor(null);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedProveedor(null);
        setIsEditing(false);
    };

    const handleSubmit = async (formData) => {
        if (isEditing) {
            await onUpdate(selectedProveedor.IdProveedor, formData);
        } else {
            await onCreate(formData);
        }
        handleCloseForm();
    };

    return (
        <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
                    Nuevo Proveedor
                </Button>
            </Box>
            <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Contacto</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {proveedores.map((proveedor) => (
                            <TableRow key={proveedor.IdProveedor} hover>
                                <TableCell>{proveedor.IdProveedor}</TableCell>
                                <TableCell>{proveedor.Nombre}</TableCell>
                                <TableCell>{proveedor.Contacto || "-"}</TableCell>
                                <TableCell>{proveedor.Telefono || "-"}</TableCell>
                                <TableCell>{proveedor.Email || "-"}</TableCell>
                                <TableCell>{proveedor.Direccion || "-"}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Editar">
                                        <IconButton color="primary" onClick={() => handleEdit(proveedor)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton color="error" onClick={() => onDelete(proveedor.IdProveedor)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                <DialogContent>
                    <ProveedorForm
                        proveedor={selectedProveedor}
                        onSubmit={handleSubmit}
                        onCancel={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
} 