import React, { useState, useEffect } from "react";

export default function OperadoresList({ operadores, maquinas, loading, error, asignarMaquinas }) {
    const [selectedMaquinas, setSelectedMaquinas] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!operadores || operadores.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay operadores</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza agregando un nuevo operador al sistema.</p>
            </div>
        );
    }

    const filteredOperadores = operadores.filter(op =>
        op.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.Usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Lista de Operadores</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar operador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máquinas Asignadas</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOperadores.map((op) => (
                            <tr key={op.IdOperador} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{op.IdOperador}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{op.Nombre}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{op.Usuario}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingOperador === op.IdOperador ? (
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {maquinas.map((maq) => (
                                                    <label
                                                        key={maq.IdMaquina}
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                                            ${selectedMaquinas[op.IdOperador]?.includes(maq.IdMaquina)
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={selectedMaquinas[op.IdOperador]?.includes(maq.IdMaquina)}
                                                            onChange={() => toggleMaquina(op.IdOperador, maq.IdMaquina)}
                                                        />
                                                        {maq.Nombre}
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleMaquinaChange(op.IdOperador, selectedMaquinas[op.IdOperador] || [])}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditingOperador(null)}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-wrap gap-1">
                                                {selectedMaquinas[op.IdOperador]?.map(maqId => {
                                                    const maquina = maquinas.find(m => m.IdMaquina === maqId);
                                                    return maquina ? (
                                                        <span
                                                            key={maqId}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                        >
                                                            {maquina.Nombre}
                                                        </span>
                                                    ) : null;
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setEditingOperador(op.IdOperador)}
                                                className="text-black-600 hover:text-black-900"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleMaquinaChange(op.IdOperador, [])}
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!selectedMaquinas[op.IdOperador]?.length}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 