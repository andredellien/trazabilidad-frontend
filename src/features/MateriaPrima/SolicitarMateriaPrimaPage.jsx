import React, { useState } from 'react';
import SolicitarMateriaPrimaForm from './Components/SolicitarMateriaPrimaForm';
import SolicitudesMateriaPrimaList from './Components/SolicitudesMateriaPrimaList';
import { Box, Container } from '@mui/material';

export default function SolicitarMateriaPrimaPage() {
  const [refresh, setRefresh] = useState(0);

  const handleCreated = () => setRefresh(r => r + 1);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        <Box flex={1}>
          <SolicitarMateriaPrimaForm onCreated={handleCreated} />
        </Box>
        <Box flex={2}>
          <SolicitudesMateriaPrimaList refresh={refresh} />
        </Box>
      </Box>
    </Container>
  );
} 