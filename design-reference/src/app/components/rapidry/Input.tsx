import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isError?: boolean;
  errorMessage?: string;
}

export function Input({ label, className = '', isError = false, errorMessage, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  const isLabelFloating = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full bg-transparent border-0 border-b-[1.5px] pb-2 pt-6 text-[var(--color-text-primary)] outline-none transition-all duration-200 ${
          isError 
            ? 'border-[var(--color-status-error)]' 
            : 'border-[var(--color-forest-mid)] focus:border-[var(--color-gold)]'
        }`}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          fontWeight: 400,
          lineHeight: 1.6,
          boxShadow: isError ? '0 1px 0 0 #991B1B' : undefined
        }}
      />
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none ${
          isLabelFloating 
            ? 'top-0 opacity-70' 
            : 'top-4 opacity-100'
        }`}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: isLabelFloating ? '12px' : '15px',
          fontStyle: 'italic',
          color: isError
            ? 'var(--color-status-error)'
            : isLabelFloating 
              ? (isFocused ? 'var(--color-gold)' : 'var(--color-text-secondary)')
              : 'var(--color-text-secondary)'
        }}
      >
        {label}
      </label>
      {isError && errorMessage && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-status-error)',
            marginTop: '6px'
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}