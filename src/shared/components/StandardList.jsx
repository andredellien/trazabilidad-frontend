import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TableContainer
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';

// Colores estándar para estados
const STATUS_COLORS = {
  // Estados principales
  pendiente: { color: 'warning', bgColor: '#fff3cd', textColor: '#856404' },
  en_proceso: { color: 'info', bgColor: '#d1ecf1', textColor: '#0c5460' },
  'en proceso': { color: 'info', bgColor: '#d1ecf1', textColor: '#0c5460' },
  'En Proceso': { color: 'info', bgColor: '#d1ecf1', textColor: '#0c5460' },
  completado: { color: 'success', bgColor: '#d4edda', textColor: '#155724' },
  cancelado: { color: 'error', bgColor: '#f8d7da', textColor: '#721c24' },
  aprobado: { color: 'success', bgColor: '#d4edda', textColor: '#155724' },
  rechazado: { color: 'error', bgColor: '#f8d7da', textColor: '#721c24' },
  solicitado: { color: 'warning', bgColor: '#fff3cd', textColor: '#856404' },
  recibido: { color: 'success', bgColor: '#d4edda', textColor: '#155724' },
  activo: { color: 'success', bgColor: '#d4edda', textColor: '#155724' },
  inactivo: { color: 'default', bgColor: '#e2e3e5', textColor: '#383d41' },
  
  // Estados específicos de lotes
  certificado: { color: 'success', bgColor: '#d4edda', textColor: '#155724' },
  'no certificado': { color: 'error', bgColor: '#f8d7da', textColor: '#721c24' },
  
  // Estados por defecto
  default: { color: 'default', bgColor: '#e2e3e5', textColor: '#383d41' }
};

// Iconos estándar para acciones
const ACTION_ICONS = {
  view: ViewIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  assign: AssignmentIcon,
  approve: CheckIcon,
  reject: CancelIcon,
  info: InfoIcon,
  search: SearchIcon,
  warehouse: WarehouseIcon
};

// Colores para botones de acción
const ACTION_COLORS = {
  view: 'primary',
  edit: 'warning',
  delete: 'error',
  assign: 'info',
  approve: 'success',
  reject: 'error',
  info: 'info',
  search: 'primary',
  warehouse: 'primary'
};

/**
 * Componente de lista estándar para toda la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Array de datos a mostrar
 * @param {Array} props.columns - Configuración de columnas
 * @param {Array} props.actions - Configuración de acciones
 * @param {Function} props.getActions - Función para obtener acciones dinámicas
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.error - Mensaje de error
 * @param {string} props.title - Título de la lista
 * @param {string} props.emptyMessage - Mensaje cuando no hay datos
 * @param {string} props.emptyIcon - Icono cuando no hay datos
 * @param {Function} props.onAction - Callback para acciones
 * @param {Object} props.sx - Estilos adicionales
 * @param {boolean} props.showSearch - Mostrar barra de búsqueda
 * @param {string} props.searchPlaceholder - Placeholder para búsqueda
 * @param {Function} props.onSearch - Callback para búsqueda
 */
const StandardList = ({
  data = [],
  columns = [],
  actions = [],
  getActions = null,
  loading = false,
  error = '',
  title = '',
  emptyMessage = 'No hay datos disponibles',
  emptyIcon = InfoIcon,
  onAction = () => {},
  sx = {},
  showSearch = false,
  searchPlaceholder = 'Buscar...',
  onSearch = () => {},
  ...props
}) => {
  const EmptyIcon = emptyIcon;

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    if (!status) return STATUS_COLORS.default;
    
    // Normalizar el estado: convertir a minúsculas y mantener espacios
    const normalizedStatus = status.toLowerCase().trim();
    
    // Buscar coincidencia exacta primero
    if (STATUS_COLORS[normalizedStatus]) {
      return STATUS_COLORS[normalizedStatus];
    }
    
    // Si no hay coincidencia exacta, usar el estado por defecto
    return STATUS_COLORS.default;
  };

  // Función para renderizar el estado
  const renderStatus = (status, customLabel = null) => {
    const statusConfig = getStatusColor(status);
    const label = customLabel || status;
    
    return (
      <Chip
        label={label}
        color={statusConfig.color}
        size="small"
        sx={{
          backgroundColor: statusConfig.bgColor,
          color: statusConfig.textColor,
          fontWeight: 500
        }}
      />
    );
  };

  // Función para renderizar acciones
  const renderActions = (row, rowIndex) => {
    // Si hay getActions, usar esa función para obtener acciones dinámicas
    if (getActions) {
      const dynamicActions = getActions(row);
      if (!dynamicActions || dynamicActions.length === 0) return null;

      return (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
          {dynamicActions.map((action, index) => {
            if (action.type === 'custom') {
              return (
                <Button
                  key={index}
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  size={action.size || 'small'}
                  onClick={action.onClick}
                  disabled={action.disabled?.(row)}
                  sx={action.sx}
                >
                  {action.label}
                </Button>
              );
            } else {
              const ActionIcon = ACTION_ICONS[action.type] || InfoIcon;
              const color = ACTION_COLORS[action.type] || 'default';
              
              return (
                <Tooltip key={index} title={action.tooltip || action.label || action.type}>
                  <IconButton
                    size="small"
                    color={color}
                    onClick={() => onAction(action.type, row, rowIndex)}
                    disabled={action.disabled?.(row)}
                    sx={{
                      '&:hover': {
                        backgroundColor: `${color}.light`,
                        color: `${color}.contrastText`
                      }
                    }}
                  >
                    <ActionIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              );
            }
          })}
        </Box>
      );
    }

    // Acciones estáticas (comportamiento original)
    if (!actions || actions.length === 0) return null;

    return (
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
        {actions.map((action, index) => {
          const ActionIcon = ACTION_ICONS[action.type] || InfoIcon;
          const color = ACTION_COLORS[action.type] || 'default';
          
          return (
            <Tooltip key={index} title={action.tooltip || action.label || action.type}>
              <IconButton
                size="small"
                color={color}
                onClick={() => onAction(action.type, row, rowIndex)}
                disabled={action.disabled?.(row)}
                sx={{
                  '&:hover': {
                    backgroundColor: `${color}.light`,
                    color: `${color}.contrastText`
                  }
                }}
              >
                <ActionIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  // Función para renderizar el contenido de una celda
  const renderCellContent = (column, row, rowIndex) => {
    const { key, type, render, align = 'left' } = column;
    const value = row[key];

    if (render) {
      return render(value, row, rowIndex);
    }

    switch (type) {
      case 'status':
        return renderStatus(value);
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '-';
      case 'datetime':
        return value ? new Date(value).toLocaleString() : '-';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'currency':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'actions':
        return renderActions(row, rowIndex);
      default:
        return value || '-';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {title && (
        <Typography variant="h5" mb={2} fontWeight={600} align="center">
          {title}
        </Typography>
      )}

      {showSearch && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ position: 'relative', maxWidth: 300 }}>
            <SearchIcon
              sx={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'text.secondary',
                fontSize: 20
              }}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            />
          </Box>
        </Box>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: 'grey.50',
                    borderBottom: '2px solid',
                    borderBottomColor: 'grey.200'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <EmptyIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="body1" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align={column.align || 'left'}
                      sx={{
                        borderBottom: '1px solid',
                        borderBottomColor: 'grey.200'
                      }}
                    >
                      {renderCellContent(column, row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StandardList;
