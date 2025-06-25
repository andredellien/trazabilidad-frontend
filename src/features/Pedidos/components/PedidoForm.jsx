import React, { useState } from 'react';

export default function PedidoForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        Descripcion: '',
        FechaEntrega: '',
        Cantidad: '',
        Unidad: 'kg'
    });

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
        setFormData({
            Descripcion: '',
            FechaEntrega: '',
            Cantidad: '',
            Unidad: 'kg'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mp-form">
            <div className="mp-field">
                <label htmlFor="Descripcion" className="mp-label">
                    Descripción del Pedido
                </label>
                <textarea
                    name="Descripcion"
                    id="Descripcion"
                    required
                    className="mp-input"
                    value={formData.Descripcion}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <div className="mp-field">
                <label htmlFor="FechaEntrega" className="mp-label">
                    Fecha de Entrega
                </label>
                <input
                    type="date"
                    name="FechaEntrega"
                    id="FechaEntrega"
                    required
                    className="mp-input"
                    value={formData.FechaEntrega}
                    onChange={handleChange}
                />
            </div>

            <div className="mp-row">
                <div className="mp-field">
                    <label htmlFor="Cantidad" className="mp-label">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        name="Cantidad"
                        id="Cantidad"
                        required
                        min="1"
                        className="mp-input"
                        value={formData.Cantidad}
                        onChange={handleChange}
                    />
                </div>

                <div className="mp-field">
                    <label htmlFor="Unidad" className="mp-label">
                        Unidad
                    </label>
                    <select
                        name="Unidad"
                        id="Unidad"
                        required
                        className="mp-input"
                        value={formData.Unidad}
                        onChange={handleChange}
                    >
                        <option value="kg">Kilogramos (kg)</option>
                        <option value="lts">Litros (lts)</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mp-button"
            >
                {loading ? "Creando..." : "Crear Pedido"}
            </button>
        </form>
    );
} 