import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

export default function LoteStats({ lotes }) {
  if (!lotes || lotes.length === 0) {
    return null;
  }

  const stats = {
    total: lotes.length,
    pendientes: lotes.filter(l => l.Estado?.toLowerCase() === 'pendiente').length,
    enProceso: lotes.filter(l => l.Estado?.toLowerCase() === 'en proceso').length,
    certificados: lotes.filter(l => l.Estado?.toLowerCase() === 'certificado').length,
    completados: lotes.filter(l => l.Estado?.toLowerCase() === 'completado').length,
    noCertificados: lotes.filter(l => l.Estado?.toLowerCase() === 'no certificado').length
  };

  const getPercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'warning';
      case 'en proceso':
        return 'info';
      case 'certificado':
      case 'completado':
        return 'success';
      case 'no certificado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return <PendingIcon />;
      case 'en proceso':
        return <InventoryIcon />;
      case 'certificado':
      case 'completado':
        return <CheckCircleIcon />;
      case 'no certificado':
        return <ErrorIcon />;
      default:
        return <InventoryIcon />;
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        📊 Estadísticas de Lotes
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total de lotes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="primary" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Lotes
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getPercentage(stats.total)} 
                color="primary"
                sx={{ mt: 1 }}
              />
            </CardContent>
            
          </Card>
        </Grid>

        {/* Lotes pendientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="warning.main" fontWeight="bold">
                {stats.pendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getPercentage(stats.pendientes)} 
                color="warning"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Lotes en proceso */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="info.main" fontWeight="bold">
                {stats.enProceso}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Proceso
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getPercentage(stats.enProceso)} 
                color="info"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Lotes certificados */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="success.main" fontWeight="bold">
                {stats.certificados + stats.completados}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Certificados/Completados
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getPercentage(stats.certificados + stats.completados)} 
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribución detallada */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Distribución por Estado:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(stats).map(([key, value]) => {
            if (key === 'total') return null;
            const status = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <Chip
                key={key}
                icon={getStatusIcon(status)}
                label={`${status}: ${value} (${getPercentage(value)}%)`}
                color={getStatusColor(status)}
                variant="outlined"
                size="medium"
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
} 