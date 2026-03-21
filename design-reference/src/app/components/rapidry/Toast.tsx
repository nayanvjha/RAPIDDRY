import React, { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'default';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  isVisible: boolean;
  onDismiss?: () => void;
  duration?: number;
}

export function Toast({ 
  message, 
  variant = 'default', 
  isVisible, 
  onDismiss,
  duration = 3000 
}: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (isVisible && onDismiss && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss, duration]);

  // Variant styles configuration
  const variantConfig = {
    default: {
      background: '#0F2E2A',
      textColor: '#F3EFE6',
      iconColor: '#D6B97B',
      border: 'none',
      icon: 'info'
    },
    success: {
      background: '#0F2E2A',
      textColor: '#F3EFE6',
      iconColor: '#15803D',
      border: '3px solid #15803D',
      icon: 'check'
    },
    error: {
      background: '#0F2E2A',
      textColor: '#F3EFE6',
      iconColor: '#991B1B',
      border: '3px solid #991B1B',
      icon: 'x'
    },
    info: {
      background: '#0F2E2A',
      textColor: '#F3EFE6',
      iconColor: '#D6B97B',
      border: '3px solid #D6B97B',
      icon: 'info'
    }
  };

  const config = variantConfig[variant];

  // Icon components
  const renderIcon = () => {
    const iconProps = {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { flexShrink: 0 }
    };

    switch (config.icon) {
      case 'check':
        return (
          <svg {...iconProps}>
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke={config.iconColor} 
              strokeWidth="2"
            />
            <path 
              d="M8 12L11 15L16 9" 
              stroke={config.iconColor} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        );
      
      case 'x':
        return (
          <svg {...iconProps}>
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke={config.iconColor} 
              strokeWidth="2"
            />
            <path 
              d="M15 9L9 15M9 9L15 15" 
              stroke={config.iconColor} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
      
      case 'info':
      default:
        return (
          <svg {...iconProps}>
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke={config.iconColor} 
              strokeWidth="2"
            />
            <path 
              d="M12 16V12M12 8H12.01" 
              stroke={config.iconColor} 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="fixed left-5 right-5 flex items-center gap-[10px] transition-all"
      style={{
        bottom: '96px',
        minHeight: '48px',
        padding: '14px 18px',
        borderRadius: '14px',
        background: config.background,
        borderLeft: config.border,
        boxShadow: '0px 8px 24px rgba(15,46,42,0.25)',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0,
        transitionDuration: isVisible ? '250ms' : '200ms',
        transitionTimingFunction: isVisible ? 'ease-out' : 'ease-in',
        pointerEvents: isVisible ? 'auto' : 'none',
        zIndex: 1000
      }}
    >
      {/* Icon */}
      {renderIcon()}

      {/* Message */}
      <p
        className="flex-1"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 400,
          color: config.textColor,
          lineHeight: 1.4,
          margin: 0
        }}
      >
        {message}
      </p>
    </div>
  );
}
