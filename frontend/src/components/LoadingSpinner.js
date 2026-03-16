import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner - Animated loading indicator
 * Variants: 'default' | 'small' | 'overlay'
 */
function LoadingSpinner({ variant = 'default', message = 'Loading...' }) {
  if (variant === 'overlay') {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner-container">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          {message && <p className="loading-text">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-spinner-container loading-${variant}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
      </div>
      {message && variant !== 'small' && (
        <p className="loading-text">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
