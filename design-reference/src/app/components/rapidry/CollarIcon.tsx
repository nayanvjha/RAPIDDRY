import React from 'react';

interface CollarIconProps {
  size?: number;
  className?: string;
}

export function CollarIcon({ size = 80, className = '' }: CollarIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dress shirt collar - matching the actual Rapidry logo */}
      
      {/* Left collar panel - cream/off-white */}
      <path
        d="M 15 25 Q 18 22, 22 20 L 32 18 L 38 40 L 28 52 L 20 48 Q 15 35, 15 25 Z"
        fill="#F3EFE6"
      />
      
      {/* Right collar panel - cream/off-white */}
      <path
        d="M 65 25 Q 62 22, 58 20 L 48 18 L 42 40 L 52 52 L 60 48 Q 65 35, 65 25 Z"
        fill="#F3EFE6"
      />
      
      {/* Gold curved band at top */}
      <ellipse
        cx="40"
        cy="20"
        rx="22"
        ry="8"
        fill="#D6B97B"
      />
      
      {/* Inner shadow on gold band for depth */}
      <path
        d="M 18 20 Q 40 26, 62 20 Q 40 22, 18 20 Z"
        fill="#0F2E2A"
        opacity="0.12"
      />
    </svg>
  );
}