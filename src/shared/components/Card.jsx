import React from 'react';

/**
 * Componente Card centralizado con estilos consistentes
 */
const Card = ({
  title,
  children,
  footer,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...props}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
