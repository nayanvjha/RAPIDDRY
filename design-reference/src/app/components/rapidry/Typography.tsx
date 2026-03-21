import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DisplayXL({ children, className = '', style }: TypographyProps) {
  return (
    <h1 
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        fontWeight: 700,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
        ...style
      }}
    >
      {children}
    </h1>
  );
}

export function DisplayL({ children, className = '', style }: TypographyProps) {
  return (
    <h1 
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '26px',
        fontWeight: 700,
        letterSpacing: '-0.3px',
        lineHeight: 1.25,
        ...style
      }}
    >
      {children}
    </h1>
  );
}

export function Heading1({ children, className = '', style }: TypographyProps) {
  return (
    <h2 
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 600,
        letterSpacing: '-0.2px',
        lineHeight: 1.3,
        ...style
      }}
    >
      {children}
    </h2>
  );
}

export function Heading2({ children, className = '', style }: TypographyProps) {
  return (
    <h3 
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: '0px',
        lineHeight: 1.35,
        ...style
      }}
    >
      {children}
    </h3>
  );
}

export function LabelL({ children, className = '', style }: TypographyProps) {
  return (
    <span 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        fontWeight: 600,
        letterSpacing: '0.2px',
        lineHeight: 1.4,
        ...style
      }}
    >
      {children}
    </span>
  );
}

export function LabelM({ children, className = '', style }: TypographyProps) {
  return (
    <span 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.15px',
        lineHeight: 1.4,
        ...style
      }}
    >
      {children}
    </span>
  );
}

export function LabelS({ children, className = '', style }: TypographyProps) {
  return (
    <span 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.4px',
        lineHeight: 1.5,
        ...style
      }}
    >
      {children}
    </span>
  );
}

export function BodyL({ children, className = '', style }: TypographyProps) {
  return (
    <p 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        fontWeight: 400,
        letterSpacing: '0px',
        lineHeight: 1.6,
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function BodyM({ children, className = '', style }: TypographyProps) {
  return (
    <p 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0px',
        lineHeight: 1.55,
        ...style
      }}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className = '', style }: TypographyProps) {
  return (
    <span 
      className={className}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '0.1px',
        lineHeight: 1.5,
        ...style
      }}
    >
      {children}
    </span>
  );
}
