import React, { useState } from 'react';
import RecepcionMateriaPrimaList from './Components/RecepcionMateriaPrimaList';
import RecepcionMateriaPrimaModal from './Components/RecepcionMateriaPrimaModal';
import { Container } from '@mui/material';

export default function RecepcionMateriaPrimaPage() {
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleRecepcionar = (row) => setSelected(row);
  const handleClose = () => setSelected(null);
  const handleSaved = () => setRefresh(r => r + 1);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <RecepcionMateriaPrimaList onRecepcionar={handleRecepcionar} refresh={refresh} />
      <RecepcionMateriaPrimaModal
        open={!!selected}
        onClose={handleClose}
        materiaPrima={selected}
        onSaved={handleSaved}
      />
    </Container>
  );
} 