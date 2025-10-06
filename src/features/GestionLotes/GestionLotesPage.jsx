import React, { useState } from 'react';
import LoteForm from './components/LoteForm';
import LoteList from './components/LoteList';
import LoteStats from './components/LoteStats';
import useLotes from './hooks/useLotes';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import './styles/Lotes.css';

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`lote-tabpanel-${index}`}
			aria-labelledby={`lote-tab-${index}`}
			{...other}
		>
			{value === index && <div className="py-6">{children}</div>}
		</div>
	);
}

export default function GestionLotesPage() {
	const [tabValue, setTabValue] = useState(0);
	const [refreshList, setRefreshList] = useState(0);
	const { data: lotes } = useLotes();

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleLoteCreated = () => {
		setRefreshList(prev => prev + 1);
		setTabValue(1); // Cambiar a la pestaña de lista
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold text-primary mb-4">
					Gestión de Lotes
				</h1>
				<p className="text-lg text-secondary">
					Administre la creación y seguimiento de lotes de producción
				</p>
			</div>

			<Card className="mb-6">
				<div className="flex border-b border-light">
					<button
						className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
							tabValue === 0 
								? 'text-primary border-b-2 border-primary bg-primary-light' 
								: 'text-secondary hover:text-primary'
						}`}
						onClick={() => setTabValue(0)}
					>
						Crear Lote
					</button>
					<button
						className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
							tabValue === 1 
								? 'text-primary border-b-2 border-primary bg-primary-light' 
								: 'text-secondary hover:text-primary'
						}`}
						onClick={() => setTabValue(1)}
					>
						Ver Lotes
					</button>
				</div>
			</Card>

			<TabPanel value={tabValue} index={0}>
				<LoteForm onCreated={handleLoteCreated} />
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				<LoteStats lotes={lotes} />
				<LoteList key={refreshList} />
			</TabPanel>
		</div>
	);
}
