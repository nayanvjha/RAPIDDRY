import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  variant?: 'light' | 'dark';
}

export function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  ctaOnClick,
  variant = 'light'
}: EmptyStateProps) {
  const isDark = variant === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px'
      }}
    >
      {/* Icon Container */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isDark ? 'rgba(214,185,123,0.08)' : 'rgba(214,185,123,0.10)',
          border: '1.5px solid rgba(214,185,123,0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '32px', height: '32px', color: '#D6B97B' }}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          marginTop: '20px',
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 600,
          color: isDark ? '#F3EFE6' : '#0F2E2A',
          textAlign: 'center'
        }}
      >
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            marginTop: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 400,
            color: isDark ? '#9CAB9A' : '#64748B',
            textAlign: 'center',
            maxWidth: '260px'
          }}
        >
          {subtitle}
        </p>
      )}

      {/* CTA Button */}
      {ctaLabel && ctaOnClick && (
        <button
          onClick={ctaOnClick}
          className="transition-all active:scale-95"
          style={{
            marginTop: '24px',
            background: '#D6B97B',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 28px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: 'pointer',
            boxShadow: '0px 4px 16px rgba(214,185,123,0.3)'
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
