import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  MenuItem, 
  Alert, 
  CircularProgress,
  IconButton,
  Card,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tooltip
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NumberStepper from './NumberStepper';

/**
 * ModalForm - Componente modal estandarizado para formularios
 * Basado en MateriaPrimaBaseForm pero adaptable para cualquier formulario
 */
export default function ModalForm({
  // Props del modal
  isOpen = false,
  onClose,
  title = "Formulario",
  
  // Props del formulario
  onSubmit,
  loading = false,
  error = '',
  success = '',
  
  // Configuración de campos
  fields = [],
  
  // Configuración de listas dinámicas
  dynamicLists = [],
  
  // Configuración de botones
  submitButtonText = "Guardar",
  cancelButtonText = "Cancelar",
  showCancelButton = true,
  
  // Props adicionales
  maxWidth = "sm",
  fullWidth = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  
  // Valores iniciales y validación
  initialValues = {},
  validate = null,
  
  // Callbacks
  onFieldChange = null,
  onSuccess = null,
  
  // Estilos personalizados
  sx = {},
  contentSx = {},
  actionsSx = {}
}) {
  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Resetear formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues);
      setFieldErrors({});
      setTouched({});
    }
  }, [isOpen, initialValues]);

  // Manejar cambios en los campos
  const handleFieldChange = (fieldName, value) => {
    const newFormData = {
      ...formData,
      [fieldName]: value
    };
    
    setFormData(newFormData);
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
    
    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    // Callback personalizado si existe - puede devolver datos actualizados
    if (onFieldChange) {
      const updatedData = onFieldChange(fieldName, value, newFormData);
      if (updatedData && typeof updatedData === 'object') {
        setFormData(updatedData);
      }
    }
  };

  // Manejar listas dinámicas
  const handleAddListItem = (listName) => {
    const listConfig = dynamicLists.find(list => list.name === listName);
    if (listConfig) {
      const newItem = {};
      listConfig.fields.forEach(field => {
        newItem[field.name] = field.defaultValue || '';
      });
      
      setFormData(prev => ({
        ...prev,
        [listName]: [...(prev[listName] || []), newItem]
      }));
    }
  };

  const handleRemoveListItem = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  const handleListItemChange = (listName, index, fieldName, value) => {
    setFormData(prev => {
      const newList = [...prev[listName]];
      newList[index] = {
        ...newList[index],
        [fieldName]: value
      };
      return {
        ...prev,
        [listName]: newList
      };
    });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación personalizada si existe
    if (validate) {
      const validationErrors = validate(formData);
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        return;
      }
    }
    
    // Validación básica de campos requeridos
    const basicErrors = {};
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (field.type === 'file') {
          if (!value || !value.name) {
            basicErrors[field.name] = `${field.label} es obligatorio`;
          }
        } else if (!value || value === '') {
          basicErrors[field.name] = `${field.label} es obligatorio`;
        }
      }
    });
    
    if (Object.keys(basicErrors).length > 0) {
      setFieldErrors(basicErrors);
      return;
    }
    
    // Ejecutar callback de envío
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  // Estado para previsualización de imágenes
  const [imagePreviews, setImagePreviews] = useState({});

  // Manejar cambios en campos de archivo con previsualización
  const handleFileFieldChange = (fieldName, file) => {
    handleFieldChange(fieldName, file);
    
    // Crear previsualización para imágenes
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [fieldName]: url
      }));
    } else {
      setImagePreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };

  // Limpiar URLs de previsualización cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      Object.values(imagePreviews).forEach(url => URL.revokeObjectURL(url));
      setImagePreviews({});
    }
  }, [isOpen]);

  // Renderizar campo según su tipo
  const renderField = (field) => {
    const { 
      name, 
      label, 
      type = 'text', 
      required = false, 
      options = [], 
      ...fieldProps 
    } = field;
    
    const value = formData[name] || '';
    const error = fieldErrors[name] || '';
    const hasError = !!error && touched[name];
    
    const commonProps = {
      name,
      label,
      value,
      onChange: (e) => handleFieldChange(name, e.target.value),
      fullWidth: true,
      margin: "normal",
      required,
      error: hasError,
      helperText: hasError ? error : '',
      ...fieldProps
    };

    switch (type) {
      case 'select':
        return (
          <TextField
            {...commonProps}
            select
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      
      case 'number':
        return (
          <NumberStepper
            {...commonProps}
            onChange={(value) => handleFieldChange(name, value)}
            value={value}
          />
        );
      
      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={field.rows || 3}
          />
        );
      
      case 'file':
        return (
          <Box>
            <input
              type="file"
              accept={field.accept}
              onChange={(e) => {
                const file = e.target.files[0];
                handleFileFieldChange(name, file);
              }}
              style={{ display: 'none' }}
              id={`file-input-${name}`}
            />
            <label htmlFor={`file-input-${name}`}>
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ 
                  height: '56px',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  '&:hover': {
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  }
                }}
                disabled={fieldProps.disabled}
              >
                {value ? `Archivo seleccionado: ${value.name}` : `Seleccionar ${label.toLowerCase()}`}
              </Button>
            </label>
            
            {/* Previsualización de imagen */}
            {imagePreviews[name] && field.accept?.includes('image') && (
              <Box sx={{ 
                mt: 2, 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Box
                  component="img"
                  src={imagePreviews[name]}
                  alt="Preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    bgcolor: '#f5f5f5'
                  }}
                />
              </Box>
            )}
            
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>
        );
      
      default:
        return (
          <TextField
            {...commonProps}
            type={type}
          />
        );
    }
  };

  // Renderizar lista dinámica
  const renderDynamicList = (listConfig) => {
    const { name, title, fields, addButtonText = 'Agregar', customSpacing } = listConfig;
    const listItems = formData[name] || [];

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight={600}>
            {title}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddListItem(name)}
            size="small"
            disabled={loading}
          >
            {addButtonText}
          </Button>
        </Box>

        {listItems.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay elementos agregados. Haga clic en "{addButtonText}" para comenzar.
          </Alert>
        )}

        {listItems.map((item, index) => (
          <Card key={index} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-end', 
              gap: 2, 
              minHeight: customSpacing?.minHeight || '56px',
              ...customSpacing?.containerSx 
            }}>
              {fields.map(field => (
                <Box key={field.name} sx={{ 
                  flex: field.width || 1, 
                  minWidth: 0, 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  ...customSpacing?.fieldSx 
                }}>
                  {renderListItemField(field, name, index, item)}
                </Box>
              ))}
              <Box sx={{ 
                flexShrink: 0, 
                display: 'flex', 
                alignItems: 'center', 
                pb: customSpacing?.deleteButtonPadding || '8px' 
              }}>
                <Button
                  color="error"
                  onClick={() => handleRemoveListItem(name, index)}
                  disabled={loading}
                  size="small"
                  variant="outlined"
                >
                  Borrar
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  // Renderizar campo dentro de lista dinámica
  const renderListItemField = (field, listName, index, item) => {
    const { name, label, type = 'text', options = [], ...fieldProps } = field;
    const value = item[name] || '';
    
    const commonProps = {
      label,
      value,
      onChange: (e) => handleListItemChange(listName, index, name, e.target.value),
      fullWidth: true,
      size: "small",
      sx: { minWidth: 0 },
      ...fieldProps
    };

    switch (type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel id="materia-label">Materia Prima Base</InputLabel>
            <Select
              {...commonProps}
              labelId={label}
              id="materia-select"
              label={label}
            >
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        );
      
      case 'number':
        return (
          <NumberStepper
            {...commonProps}
            onChange={(value) => handleListItemChange(listName, index, name, value)}
            value={value}
            size="small"
            sx={{ 
              minWidth: 0,
              height: '56px',
              '& .MuiInputBase-root': {
                height: '40px'
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
                padding: '8px 12px',
                height: '40px'
              }
            }}
          />
        );
      
      default:
        return (
          <TextField
            {...commonProps}
            type={type}
            size="small"
            sx={{ 
              minWidth: 0,
              height: '56px',
              '& .MuiInputBase-root': {
                height: '40px'
              },
              '& .MuiInputBase-input': {
                fontSize: '0.875rem',
                padding: '8px 12px',
                height: '40px'
              }
            }}
          />
        );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 2,
          ...sx
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div" fontWeight={600}>
          {title}
        </Typography>
        
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, ...contentSx }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {fields.map((field) => (
            <Box key={field.name}>
              {renderField(field)}
            </Box>
          ))}

          {dynamicLists.map((listConfig) => (
            <Box key={listConfig.name}>
              {renderDynamicList(listConfig)}
            </Box>
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, ...actionsSx }}>
          {showCancelButton && (
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
              size="small"
            >
              {cancelButtonText}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            size="small"
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              submitButtonText
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
