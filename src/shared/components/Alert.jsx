import React from 'react';

/**
 * Componente Alert centralizado con variantes consistentes
 */
const Alert = ({
  type = 'info',
  title,
  children,
  className = '',
  onClose,
  ...props
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };
  
  const classes = [
    'alert',
    `alert-${type}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} {...props}>
      <span className="alert-icon">{getIcon()}</span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="modal-close"
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
