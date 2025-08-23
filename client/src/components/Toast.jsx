import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  // Listen for custom toast events
  useEffect(() => {
    const handleToast = (event) => {
      const { type = 'info', title, message, duration = 5000 } = event.detail;
      const id = Date.now() + Math.random();
      
      const newToast = {
        id,
        type,
        title,
        message,
        duration,
        createdAt: Date.now()
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto-remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type) => {
    const styles = {
      success: {
        bg: 'bg-github-success',
        border: 'border-green-600',
        icon: CheckCircle,
        textColor: 'text-white'
      },
      error: {
        bg: 'bg-github-danger',
        border: 'border-red-600',
        icon: XCircle,
        textColor: 'text-white'
      },
      warning: {
        bg: 'bg-github-warning',
        border: 'border-yellow-600',
        icon: AlertCircle,
        textColor: 'text-black'
      },
      info: {
        bg: 'bg-github-surface',
        border: 'border-github-border',
        icon: Info,
        textColor: 'text-github-text'
      }
    };
    return styles[type] || styles.info;
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" data-testid="toast-container">
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type);
        const IconComponent = style.icon;
        
        return (
          <div
            key={toast.id}
            className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-lg flex items-center space-x-3 min-w-80 transform transition-all duration-300`}
            data-testid={`toast-${toast.type}`}
          >
            <IconComponent size={20} className={style.textColor} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${style.textColor}`}>
                {toast.title}
              </p>
              {toast.message && (
                <p className={`text-xs mt-1 ${style.textColor} opacity-90`}>
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`${style.textColor} hover:opacity-75`}
              data-testid={`button-dismiss-toast-${toast.id}`}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to show toasts
export const showToast = (type, title, message, duration = 5000) => {
  const event = new CustomEvent('show-toast', {
    detail: { type, title, message, duration }
  });
  window.dispatchEvent(event);
};
