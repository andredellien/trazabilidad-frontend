import React from 'react';

/**
 * Componente Select centralizado con estilos consistentes
 */
const Select = ({
  label,
  error,
  help,
  options = [],
  placeholder,
  className = '',
  ...props
}) => {
  const selectClasses = [
    'form-select',
    error ? 'border-error' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <select
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value || option}
            value={option.value || option}
          >
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <div className="form-error">{error}</div>
      )}
      {help && !error && (
        <div className="form-help">{help}</div>
      )}
    </div>
  );
};

export default Select;
