import React, { useState, useEffect } from "react";
import { Edit as EditIcon } from '@mui/icons-material';
import { StandardList } from '../../../shared/components';

export default function OperadoresList({ operadores, maquinas, loading, error, asignarMaquinas }) {
    const [selectedMaquinas, setSelectedMaquinas] = useState({});
    const [editingOperador, setEditingOperador] = useState(null);

    // Cargar las máquinas asignadas cuando se monta el componente
    useEffect(() => {
        if (operadores && maquinas) {
            const initialMaquinas = {};
            operadores.forEach(op => {
                if (op.MaquinasAsignadas) {
                    const maquinaIds = op.MaquinasAsignadas.split(', ').map(nombre => {
                        const maquina = maquinas.find(m => m.Nombre === nombre);
                        return maquina ? maquina.IdMaquina : null;
                    }).filter(id => id !== null);
                    initialMaquinas[op.IdOperador] = maquinaIds;
                }
            });
            setSelectedMaquinas(initialMaquinas);
        }
    }, [operadores, maquinas]);

    // Configuración de columnas para StandardList
    const columns = [
        { key: 'IdOperador', label: 'ID', align: 'center' },
        { key: 'Nombre', label: 'Nombre', align: 'left' },
        { key: 'Usuario', label: 'Usuario', align: 'left' },
        { 
            key: 'MaquinasAsignadas', 
            label: 'Máquinas Asignadas', 
            align: 'left',
            render: (value, row) => {
                if (editingOperador === row.IdOperador) {
        return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {maquinas.map((maq) => (
                                    <label
                                        key={maq.IdMaquina}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            backgroundColor: selectedMaquinas[row.IdOperador]?.includes(maq.IdMaquina)
                                                ? '#d4edda'
                                                : '#f8f9fa',
                                            color: selectedMaquinas[row.IdOperador]?.includes(maq.IdMaquina)
                                                ? '#155724'
                                                : '#6c757d'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{ display: 'none' }}
                                            checked={selectedMaquinas[row.IdOperador]?.includes(maq.IdMaquina)}
                                            onChange={() => toggleMaquina(row.IdOperador, maq.IdMaquina)}
                                        />
                                        {maq.Nombre}
                                    </label>
                                ))}
            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleMaquinaChange(row.IdOperador, selectedMaquinas[row.IdOperador] || [])}
                                    style={{
                                        padding: '4px 12px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setEditingOperador(null)}
                                    style={{
                                        padding: '4px 12px',
                                        backgroundColor: 'white',
                                        color: '#6c757d',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                </div>
            </div>
        );
                } else {
        return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {selectedMaquinas[row.IdOperador]?.map(maqId => {
                                    const maquina = maquinas.find(m => m.IdMaquina === maqId);
                                    return maquina ? (
                                        <span
                                            key={maqId}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: '#d4edda',
                                                color: '#155724'
                                            }}
                                        >
                                            {maquina.Nombre}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                            <button
                                onClick={() => setEditingOperador(row.IdOperador)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px'
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </button>
            </div>
        );
    }
            }
        },
        { key: 'actions', label: 'Acciones', align: 'center', type: 'actions' }
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'delete',
            tooltip: 'Eliminar máquinas',
            label: 'Eliminar'
        }
    ];

    const handleMaquinaChange = async (operadorId, maquinaIds) => {
        try {
            await asignarMaquinas(operadorId, maquinaIds);
            setSelectedMaquinas(prev => ({
                ...prev,
                [operadorId]: maquinaIds
            }));
            setEditingOperador(null);
        } catch (error) {
            console.error("Error al asignar máquinas:", error);
            alert("Error al asignar las máquinas");
        }
    };

    const toggleMaquina = (operadorId, maquinaId) => {
        const currentMaquinas = selectedMaquinas[operadorId] || [];
        const newMaquinas = currentMaquinas.includes(maquinaId)
            ? currentMaquinas.filter(id => id !== maquinaId)
            : [...currentMaquinas, maquinaId];
        
        setSelectedMaquinas(prev => ({
            ...prev,
            [operadorId]: newMaquinas
        }));
    };

    // Manejar acciones
    const handleAction = (actionType, row) => {
        if (actionType === 'delete') {
            handleMaquinaChange(row.IdOperador, []);
        }
    };

    // Asegurarse de que operadores sea siempre un array
    const safeOperadores = Array.isArray(operadores) ? operadores : [];

    return (
        <StandardList
            data={safeOperadores}
            columns={columns}
            actions={actions}
            loading={loading}
            error={error}
            title=""
            emptyMessage="No hay operadores registrados"
            showSearch={true}
            searchPlaceholder="Buscar operador..."
            onAction={handleAction}
            sx={{ 
                width: '100%', 
                p: 3, 
                boxShadow: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper' 
            }}
        />
    );
} 