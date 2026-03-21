import React from 'react';

interface CardProps {
  children: React.ReactNode;
  isActive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, isActive = false, isSelected = false, isDisabled = false, className = '', onClick }: CardProps) {
  // Determine border style
  const borderStyle = isSelected 
    ? 'border-2 border-[var(--color-gold)]' 
    : isActive 
      ? 'border-l-4 border-l-[var(--color-gold)]' 
      : '';
  
  // Determine shadow style
  const shadowStyle = isSelected 
    ? 'var(--shadow-elevation-gold)' 
    : 'var(--shadow-elevation-2)';
  
  // Determine interactive styles
  const interactiveStyles = onClick && !isDisabled
    ? 'cursor-pointer hover:shadow-[var(--shadow-elevation-3)]' 
    : '';
  
  // Determine disabled styles
  const disabledStyles = isDisabled 
    ? 'opacity-45 cursor-not-allowed pointer-events-none' 
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--color-white)] rounded-[var(--radius-lg)] p-[var(--space-base)] transition-all duration-300 ${borderStyle} ${interactiveStyles} ${disabledStyles} ${className}`}
      style={{
        boxShadow: shadowStyle
      }}
    >
      {children}
    </div>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light';
  className?: string;
}

export function GlassCard({ children, variant = 'dark', className = '' }: GlassCardProps) {
  const variantStyles = variant === 'dark'
    ? 'bg-[rgba(15,46,42,0.72)] border-[rgba(214,185,123,0.15)]'
    : 'bg-[rgba(243,239,230,0.80)] border-[rgba(214,185,123,0.20)]';

  return (
    <div
      className={`rounded-[var(--radius-lg)] p-[var(--space-base)] border ${variantStyles} ${className}`}
      style={{
        backdropFilter: variant === 'dark' ? 'blur(20px)' : 'blur(16px)',
        WebkitBackdropFilter: variant === 'dark' ? 'blur(20px)' : 'blur(16px)'
      }}
    >
      {children}
    </div>
  );
}