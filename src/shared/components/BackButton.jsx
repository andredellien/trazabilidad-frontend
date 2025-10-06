import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Volver', to, sx, size = 'small', variant = 'contained', color = 'primary' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <Button onClick={handleClick} startIcon={<ArrowBackIcon />} variant={variant} color={color} size={size} sx={{ mb: 2, minWidth: 120, ...sx }}>
      {label}
    </Button>
  );
}


