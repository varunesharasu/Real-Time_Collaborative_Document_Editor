import React, { useEffect, useState } from 'react';
import './SaveIndicator.css';

/**
 * SaveIndicator - Shows document save status
 * Statuses: 'saved' | 'saving' | 'unsaved' | 'error'
 */
function SaveIndicator({ status = 'saved', lastSaved = null }) {
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    switch (status) {
      case 'saving':
        setDisplayMessage('Saving...');
        break;
      case 'saved':
        setDisplayMessage(lastSaved ? `Saved at ${lastSaved}` : 'All changes saved');
        break;
      case 'unsaved':
        setDisplayMessage('Unsaved changes');
        break;
      case 'error':
        setDisplayMessage('Failed to save');
        break;
      default:
        setDisplayMessage('');
    }
  }, [status, lastSaved]);

  return (
    <div className={`save-indicator save-indicator-${status}`}>
      <span className="save-indicator-icon">
        {status === 'saving' && <span className="spinner-mini"></span>}
        {status === 'saved' && '✓'}
        {status === 'unsaved' && '●'}
        {status === 'error' && '⚠'}
      </span>
      <span className="save-indicator-text">{displayMessage}</span>
    </div>
  );
}

export default SaveIndicator;
