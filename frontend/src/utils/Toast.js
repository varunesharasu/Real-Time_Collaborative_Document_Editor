/**
 * Toast Notification System
 * Provides reusable toast notifications with different types
 */

let toastListeners = [];

export const showToast = (message, type = 'success', duration = 3000) => {
  const id = Math.random().toString(36).substr(2, 9);
  const toast = { id, message, type, duration };
  
  toastListeners.forEach(listener => listener(toast, 'add'));
  
  if (duration > 0) {
    setTimeout(() => {
      toastListeners.forEach(listener => listener({ id }, 'remove'));
    }, duration);
  }
  
  return id;
};

export const removeToast = (id) => {
  toastListeners.forEach(listener => listener({ id }, 'remove'));
};

export const subscribeToToasts = (listener) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
};
