import React, { useState } from 'react';
import MateriaPrimaBaseForm from './Components/MateriaPrimaBaseForm';
import MateriaPrimaBaseList from './Components/MateriaPrimaBaseList';
import { Box, Container, Grid } from '@mui/material';
import MateriaPrimaBaseLogModal from './Components/MateriaPrimaBaseLogModal';

export default function MateriaPrimaBasePage() {
  const [refresh, setRefresh] = useState(0);
  const [logOpen, setLogOpen] = useState(false);
  const [selectedBase, setSelectedBase] = useState(null);

  const handleCreated = () => setRefresh(r => r + 1);
  const handleShowLog = (base) => {
    setSelectedBase(base);
    setLogOpen(true);
  };
  const handleCloseLog = () => {
    setLogOpen(false);
    setSelectedBase(null);
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MateriaPrimaBaseForm onCreated={handleCreated} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MateriaPrimaBaseList refresh={refresh} onShowLog={handleShowLog} />
        </Grid>
      </Grid>
      <MateriaPrimaBaseLogModal open={logOpen} onClose={handleCloseLog} materiaPrimaBase={selectedBase} />
    </Container>
  );
} 