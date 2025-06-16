import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Immediate show animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(id);
      }, 200); // Quick exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 shadow-green-500/20';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 shadow-red-500/20';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 shadow-yellow-500/20';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/50 shadow-blue-500/20';
    }
  };

  return (
    <div 
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg
        ${getBackgroundColor()}
        transform transition-all duration-200 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isExiting ? 'translate-x-full opacity-0 scale-95' : ''}
      `}
      style={{
        transform: isVisible && !isExiting ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: isVisible && !isExiting ? 1 : 0
      }}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm leading-tight">{title}</h4>
        {message && <p className="text-xs text-gray-300 mt-1 leading-tight">{message}</p>}
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 200);
        }}
        className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1 -m-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;