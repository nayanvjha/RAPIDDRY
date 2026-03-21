import React from 'react';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    success: {
      bg: 'bg-green-50',
      text: 'text-[var(--color-status-success)]',
      dot: 'bg-[var(--color-status-success)]'
    },
    warning: {
      bg: 'bg-[var(--color-gold-pale)]',
      text: 'text-[var(--color-status-warning)]',
      dot: 'bg-[var(--color-status-warning)]'
    },
    pending: {
      bg: 'bg-[var(--color-gold-pale)]',
      text: 'text-[var(--color-status-warning)]',
      dot: 'bg-[var(--color-status-warning)]'
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-[var(--color-status-error)]',
      dot: 'bg-[var(--color-status-error)]'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-[var(--color-status-info)]',
      dot: 'bg-[var(--color-status-info)]'
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] ${config.bg} ${className}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span 
        className={config.text}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.15px'
        }}
      >
        {label}
      </span>
    </div>
  );
}
