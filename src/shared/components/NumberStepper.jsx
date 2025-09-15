import React from 'react';
import { Box, IconButton, TextField, InputAdornment, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * NumberStepper
 * Reusable numeric input with +/- controls, aligned with existing MUI styling.
 */
export default function NumberStepper({
  label,
  value,
  onChange,
  name,
  min = 0,
  max,
  step = 1,
  size = 'medium',
  fullWidth = true,
  disabled = false,
  error = false,
  helperText,
  inputProps,
  sx,
  unit,
  margin = 'normal',
}) {
  const clamp = (next) => {
    let result = next;
    if (typeof min === 'number' && result < min) result = min;
    if (typeof max === 'number' && result > max) result = max;
    return result;
  };

  const parseNumber = (raw) => {
    if (raw === '' || raw === null || raw === undefined) return '';
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? '' : parsed;
  };

  const handleTextChange = (e) => {
    const next = parseNumber(e.target.value);
    if (next === '') {
      onChange?.(0);
      return;
    }
    onChange?.(clamp(next));
  };

  const handleIncrement = () => {
    const current = typeof value === 'number' ? value : 0;
    const next = clamp(Number((current + step).toFixed(10)));
    onChange?.(next);
  };

  const handleDecrement = () => {
    const current = typeof value === 'number' ? value : 0;
    const next = clamp(Number((current - step).toFixed(10)));
    onChange?.(next);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: fullWidth ? '100%' : 'auto', ...sx }}>
      <TextField
        label={label}
        type="text"
        name={name}
        value={typeof value === 'number' ? value : 0}
        onChange={handleTextChange}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        error={error}
        helperText={helperText}
        margin={margin}
        inputProps={{ inputMode: 'decimal', min, max, step, style: { textAlign: 'center' }, ...inputProps }}
        InputProps={{
          sx: {
            '& input': { textAlign: 'center' },
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]': { MozAppearance: 'textfield' },
          },
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title="Disminuir">
                <span>
                  <IconButton
                    aria-label="decrement"
                    size={size === 'small' ? 'small' : 'medium'}
                    onClick={handleDecrement}
                    disabled={disabled || (typeof min === 'number' && value <= min)}
                    color="primary"
                  >
                    <RemoveIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ gap: 0.5 }}>
              {unit ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mr: 0.5 }}>
                  {unit}
                </Typography>
              ) : null}
              <Tooltip title="Aumentar">
                <span>
                  <IconButton
                    aria-label="increment"
                    size={size === 'small' ? 'small' : 'medium'}
                    onClick={handleIncrement}
                    disabled={disabled || (typeof max === 'number' && value >= max)}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}


