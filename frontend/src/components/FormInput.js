import React, { useState } from 'react';
import './FormInput.css';

/**
 * FormInput - Enhanced input field with validation feedback
 */
function FormInput({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  label = '',
  required = false,
  disabled = false,
  autoComplete = 'off',
  pattern = null,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="form-input-wrapper">
      {label && (
        <label className="form-input-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className={`form-input-container ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete={autoComplete}
          pattern={pattern}
          className="form-input"
          required={required}
          {...props}
        />
      </div>
      {error && <span className="form-input-error">{error}</span>}
    </div>
  );
}

export default FormInput;
