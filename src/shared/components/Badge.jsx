import React from 'react';

/**
 * Componente Badge centralizado con variantes consistentes
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
