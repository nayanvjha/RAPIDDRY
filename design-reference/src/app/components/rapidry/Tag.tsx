import React from 'react';

export type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

export function Tag({ children, variant = 'default', className = '' }: TagProps) {
  const variantStyles = {
    default: 'bg-[var(--color-gold-pale)] text-[var(--color-forest-dark)] border-[var(--color-gold-light)]',
    success: 'bg-green-50 text-[var(--color-status-success)] border-green-200',
    warning: 'bg-[var(--color-gold-pale)] text-[var(--color-status-warning)] border-[var(--color-gold)]',
    error: 'bg-red-50 text-[var(--color-status-error)] border-red-200',
    info: 'bg-blue-50 text-[var(--color-status-info)] border-blue-200'
  };

  return (
    <span 
      className={`inline-flex items-center px-[14px] py-[6px] rounded-[var(--radius-pill)] border ${variantStyles[variant]} ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.15px',
        lineHeight: 1.4
      }}
    >
      {children}
    </span>
  );
}
