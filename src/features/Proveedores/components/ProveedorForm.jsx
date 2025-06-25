import { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, DialogActions } from "@mui/material";

export default function ProveedorForm({ proveedor, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        Nombre: "",
        Contacto: "",
        Telefono: "",
        Email: "",
        Direccion: ""
    });

    useEffect(() => {
        if (proveedor) {
            setFormData({
                Nombre: proveedor.Nombre || "",
                Contacto: proveedor.Contacto || "",
                Telefono: proveedor.Telefono || "",
                Email: proveedor.Email || "",
                Direccion: proveedor.Direccion || ""
            });
        }
    }, [proveedor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, minWidth: 320 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Nombre *"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        required
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Contacto"
                        name="Contacto"
                        value={formData.Contacto}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Teléfono"
                        name="Telefono"
                        value={formData.Telefono}
                        onChange={handleChange}
                        fullWidth
                        type="tel"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        fullWidth
                        type="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Dirección"
                        name="Direccion"
                        value={formData.Direccion}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
            <DialogActions sx={{ mt: 2, justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} color="secondary" variant="outlined">
                    Cancelar
                </Button>
                <Button type="submit" color="primary" variant="contained">
                    {proveedor ? "Actualizar" : "Crear"}
                </Button>
            </DialogActions>
        </Box>
    );
} 