import React, { useMemo, useEffect } from "react";
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar, CircularProgress, Paper, Button, Fade } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import useUser from "../../Auth/hooks/useUser";
import usePedidos from "../../Pedidos/hooks/usePedidos";
import useAuth from "../../Auth/hooks/useAuth";

const ESTADOS = [
  { key: "pendiente", label: "Pendiente", color: "warning" },
  { key: "materia prima solicitada", label: "Materia Prima Solicitada", color: "info" },
  { key: "en_proceso", label: "En Proceso", color: "primary" },
  { key: "Produccion Finalizada", label: "Producción Finalizada", color: "success" },
  { key: "Almacenado", label: "Almacenado", color: "secondary" },
  { key: "cancelado", label: "Cancelado", color: "error" },
];

export default function DashboardClientePage() {
  const { user, loading: loadingUser } = useUser();
  const { pedidos, loading: loadingPedidos, fetchPedidos } = usePedidos();
  const { logout } = useAuth();

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Filtrar pedidos del cliente logueado
  const pedidosUsuario = useMemo(() =>
    pedidos.filter(p => p.IdCliente === user?.IdOperador),
    [pedidos, user]
  );

  // KPIs
  const totalPedidos = pedidosUsuario.length;
  const pedidosPorEstado = ESTADOS.map(e => pedidosUsuario.filter(p => (p.Estado || '').toLowerCase() === e.key.toLowerCase()).length);

  // Último pedido
  const ultimoPedido = pedidosUsuario.length > 0
    ? [...pedidosUsuario].sort((a, b) => b.IdPedido - a.IdPedido)[0]
    : null;

  // Timeline del último pedido
  const estadoActual = ultimoPedido ? (ultimoPedido.Estado || '').toLowerCase() : null;
  const estadoIndex = ESTADOS.findIndex(e => e.key.toLowerCase() === estadoActual);

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Panel de Seguimiento de Pedidos
        </Typography>
      </Box>
      {loadingUser || loadingPedidos ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : (
        <>
          {/* KPIs */}
          <Grid container spacing={2} mb={3}>
            {[{
              label: "Pedidos Totales",
              value: totalPedidos,
              color: "primary.main"
            }, ...ESTADOS.map((e, i) => ({
              label: e.label,
              value: pedidosPorEstado[i],
              color: `${e.color}.main`
            }))].map((kpi, i) => (
              <Grid item xs={12} sm={6} md={2} key={kpi.label}>
                <Card sx={{ borderLeft: `6px solid`, borderColor: kpi.color, boxShadow: 2, borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">{kpi.label}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mt: 1 }}>{kpi.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Timeline del último pedido */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
              Seguimiento de tu último pedido
            </Typography>
            {ultimoPedido ? (
              <>
                <Box mb={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Pedido #{ultimoPedido.IdPedido} - Estado actual: <Chip label={ultimoPedido.Estado} color="primary" size="small" sx={{ textTransform: 'capitalize' }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Descripción: {ultimoPedido.Descripcion || 'Sin descripción'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de creación: {new Date(ultimoPedido.FechaCreacion).toLocaleDateString()}
                  </Typography>
                </Box>
                <Timeline position="alternate">
                  {ESTADOS.map((e, idx) => (
                    <TimelineItem key={e.key}>
                      <TimelineSeparator>
                        <TimelineDot 
                          color={idx < estadoIndex ? e.color : idx === estadoIndex ? e.color : 'grey'}
                          sx={idx === estadoIndex ? { boxShadow: 4, border: '3px solid', borderColor: 'primary.main', width: 32, height: 32 } : {}}
                        />
                        {idx < ESTADOS.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography 
                          color={idx === estadoIndex ? 'primary.main' : idx < estadoIndex ? `${e.color}.main` : 'text.secondary'}
                          fontWeight={idx === estadoIndex ? 900 : idx < estadoIndex ? 600 : 400}
                          fontSize={idx === estadoIndex ? 20 : 16}
                        >
                          {e.label}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </>
            ) : (
              <Typography color="text.secondary">No tienes pedidos registrados aún.</Typography>
            )}
          </Paper>

          {/* Lista de pedidos recientes */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
              Tus pedidos recientes
            </Typography>
            {pedidosUsuario.length === 0 ? (
              <Typography color="text.secondary">No tienes pedidos registrados.</Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Descripción</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...pedidosUsuario].sort((a, b) => b.IdPedido - a.IdPedido).slice(0, 10).map(p => (
                      <tr key={p.IdPedido} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 8 }}>{p.IdPedido}</td>
                        <td style={{ padding: 8 }}>{p.Descripcion || 'Sin descripción'}</td>
                        <td style={{ padding: 8 }}>{new Date(p.FechaCreacion).toLocaleDateString()}</td>
                        <td style={{ padding: 8 }}>
                          <Chip label={p.Estado} color="primary" size="small" sx={{ textTransform: 'capitalize' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

export { DashboardClientePage }; 