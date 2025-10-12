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
  CardContent,
  Grid,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NumberStepper from './NumberStepper';

/**
 * ModalFormWithDynamicList - ModalForm extendido para manejar listas dinámicas
 * Especializado para formularios que requieren agregar/quitar elementos dinámicamente
 */
export default function ModalFormWithDynamicList({
  // Props del modal
  isOpen = false,
  onClose,
  title = "Formulario",
  
  // Props del formulario
  onSubmit,
  loading = false,
  error = '',
  success = '',
  
  // Configuración de campos estáticos
  staticFields = [],
  
  // Configuración de lista dinámica
  dynamicListConfig = null,
  
  // Configuración de botones
  submitButtonText = "Guardar",
  cancelButtonText = "Cancelar",
  showCancelButton = true,
  
  // Props adicionales
  maxWidth = "md",
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

  // Manejar cambios en los campos estáticos
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
    
    // Callback personalizado si existe
    if (onFieldChange) {
      const updatedData = onFieldChange(fieldName, value, newFormData);
      if (updatedData && typeof updatedData === 'object') {
        setFormData(updatedData);
      }
    }
  };

  // Manejar cambios en elementos de la lista dinámica
  const handleListItemChange = (index, field, value) => {
    const newList = [...formData[dynamicListConfig.fieldName]];
    newList[index] = {
      ...newList[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      [dynamicListConfig.fieldName]: newList
    }));
  };

  // Agregar elemento a la lista dinámica
  const handleAddListItem = () => {
    const newItem = { ...dynamicListConfig.defaultItem };
    setFormData(prev => ({
      ...prev,
      [dynamicListConfig.fieldName]: [...prev[dynamicListConfig.fieldName], newItem]
    }));
  };

  // Eliminar elemento de la lista dinámica
  const handleRemoveListItem = (index) => {
    setFormData(prev => ({
      ...prev,
      [dynamicListConfig.fieldName]: prev[dynamicListConfig.fieldName].filter((_, i) => i !== index)
    }));
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
    staticFields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        basicErrors[field.name] = `${field.label} es obligatorio`;
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

  // Renderizar campo estático según su tipo
  const renderStaticField = (field) => {
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
      
      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={field.rows || 3}
          />
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

  // Renderizar elemento de la lista dinámica
  const renderListItem = (item, index) => {
    const { fields } = dynamicListConfig;
    
    return (
      <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {fields.map((field) => {
            const { name, label, type = 'text', options = [], ...fieldProps } = field;
            const value = item[name] || '';
            
            const commonProps = {
              label,
              value,
              onChange: (e) => handleListItemChange(index, name, e.target.value),
              fullWidth: true,
              size: "small",
              ...fieldProps
            };

            switch (type) {
              case 'select':
                return (
                  <Grid item xs={12} md={5} key={name}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{label}</InputLabel>
                      <Select
                        {...commonProps}
                        label={label}
                      >
                        {options.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                );
              
              case 'number':
                return (
                  <Grid item xs={12} md={3} key={name}>
                    <NumberStepper
                      {...commonProps}
                      onChange={(v) => handleListItemChange(index, name, v)}
                      value={value}
                    />
                  </Grid>
                );
              
              default:
                return (
                  <Grid item xs={12} md={5} key={name}>
                    <TextField
                      {...commonProps}
                      type={type}
                      size="small"
                    />
                  </Grid>
                );
            }
          })}
          
          <Grid item xs={12} md={1}>
            <Tooltip title="Eliminar">
              <IconButton
                color="error"
                onClick={() => handleRemoveListItem(index)}
                disabled={loading}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Card>
    );
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
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ ml: 1 }}
        >
          <CloseIcon />
        </IconButton>
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

          {/* Campos estáticos */}
          {staticFields.map((field) => (
            <Box key={field.name}>
              {renderStaticField(field)}
            </Box>
          ))}

          {/* Lista dinámica */}
          {dynamicListConfig && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="primary" fontWeight={600}>
                  {dynamicListConfig.title}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddListItem}
                  disabled={loading}
                  size="small"
                >
                  {dynamicListConfig.addButtonText || 'Agregar'}
                </Button>
              </Box>

              {formData[dynamicListConfig.fieldName]?.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No hay elementos agregados. Haga clic en "{dynamicListConfig.addButtonText || 'Agregar'}" para comenzar.
                </Alert>
              )}

              {formData[dynamicListConfig.fieldName]?.map((item, index) => 
                renderListItem(item, index)
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, ...actionsSx }}>
          {showCancelButton && (
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={loading}
            >
              {cancelButtonText}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 120 }}
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
