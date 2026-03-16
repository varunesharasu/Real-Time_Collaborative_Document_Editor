import React, { useState, useEffect } from 'react';
import { subscribeToToasts } from '../utils/Toast';
import './ToastContainer.css';

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast, action) => {
      if (action === 'add') {
        setToasts(prev => [...prev, toast]);
      } else if (action === 'remove') {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '⚠'}
              {toast.type === 'info' && 'ℹ'}
              {toast.type === 'warning' && '!'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
