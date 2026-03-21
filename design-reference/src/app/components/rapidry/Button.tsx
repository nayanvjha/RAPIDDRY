import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  fullWidth = true, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "h-[56px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[var(--color-gold)] text-[var(--color-forest-dark)] rounded-[var(--radius-pill)] shadow-[var(--shadow-elevation-gold)] hover:bg-[var(--color-gold-light)] active:scale-[0.98]",
    secondary: "bg-transparent border-[1.5px] border-[var(--color-forest-dark)] text-[var(--color-forest-dark)] rounded-[var(--radius-pill)] hover:bg-[var(--color-forest-dark)] hover:text-[var(--color-text-on-dark)] active:scale-[0.98]",
    ghost: "bg-transparent text-[var(--color-gold)] hover:text-[var(--color-gold-light)] active:scale-[0.95]"
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${className}`}
      {...props}
    >
      <span style={{ 
        fontFamily: 'var(--font-body)', 
        fontWeight: 600,
        fontSize: '15px',
        letterSpacing: '0.2px'
      }}>
        {children}
      </span>
    </button>
  );
}