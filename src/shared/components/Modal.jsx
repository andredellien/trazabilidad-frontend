import React, { useEffect } from 'react';
import Button from './Button';

export default function Modal({ isOpen, onClose, onConfirm, title, message, type = 'info', showConfirmButton = false }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal animate-fade-in">
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getIcon()}</span>
            <h3 className="modal-title">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <p className="text-secondary">{message}</p>
        </div>
        
        <div className="modal-footer">
          {showConfirmButton && (
            <Button
              variant={type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'primary'}
              onClick={onConfirm}
            >
              Confirmar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
          >
            {showConfirmButton ? 'Cancelar' : 'Cerrar'}
          </Button>
        </div>
      </div>
    </div>
  );
} 