import React, { useState, useEffect } from 'react';
import { CheckCircle, CircleAlert, X, Info, TriangleAlert } from 'lucide-react';

let toastId = 0;
let addToastFn = null;

// External function to trigger toasts from anywhere
export const showToast = (message, type = 'success') => {
  if (addToastFn) {
    addToastFn({ id: ++toastId, message, type });
  }
};

const icons = {
  success: <CheckCircle />,
  error: <CircleAlert />,
  info: <Info />,
  warning: <TriangleAlert />
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (toast) => {
      setToasts((prev) => [...prev, toast]);
      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{icons[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
