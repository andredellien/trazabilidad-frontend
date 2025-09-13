import React from 'react';

/**
 * Componente Button centralizado con variantes consistentes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    success: 'btn-success',
    error: 'btn-error',
    warning: 'btn-warning'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'btn-full' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="animate-spin" style={{ marginRight: '0.5rem' }}>
          ⟳
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
