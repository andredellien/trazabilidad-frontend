import React from 'react';

/**
 * Componente Input centralizado con estilos consistentes
 */
const Input = ({
  label,
  error,
  help,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'form-input',
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
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <div className="form-error">{error}</div>
      )}
      {help && !error && (
        <div className="form-help">{help}</div>
      )}
    </div>
  );
};

export default Input;
