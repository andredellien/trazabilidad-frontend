import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, Typography, Paper } from '@mui/material';
import { Add as AddIcon, List as ListIcon } from '@mui/icons-material';
import LoteForm from './components/LoteForm';
import LoteList from './components/LoteList';
import LoteStats from './components/LoteStats';
import useLotes from './hooks/useLotes';
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
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
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
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Typography variant="h3" component="h1" gutterBottom align="center" color="primary" fontWeight="bold">
				🏭 Gestión de Lotes
			</Typography>
			
			<Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
				Administre la creación y seguimiento de lotes de producción
			</Typography>

			<Paper elevation={2} sx={{ mb: 3 }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label="gestión de lotes tabs"
					variant="fullWidth"
					sx={{
						'& .MuiTab-root': {
							minHeight: 64,
							fontSize: '1rem',
							fontWeight: 600
						}
					}}
				>
					<Tab
						icon={<AddIcon />}
						label="Crear Lote"
						iconPosition="start"
						sx={{ py: 2 }}
					/>
					<Tab
						icon={<ListIcon />}
						label="Ver Lotes"
						iconPosition="start"
						sx={{ py: 2 }}
					/>
				</Tabs>
			</Paper>

			<TabPanel value={tabValue} index={0}>
				<LoteForm onCreated={handleLoteCreated} />
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				<LoteStats lotes={lotes} />
				<LoteList key={refreshList} />
			</TabPanel>
		</Container>
	);
}
