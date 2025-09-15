import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Volver', to, sx, size = 'medium', variant = 'outlined', color = 'primary' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <Button onClick={handleClick} startIcon={<ArrowBackIcon />} variant={variant} color={color} size={size} sx={{ mb: 2, ...sx }}>
      {label}
    </Button>
  );
}


