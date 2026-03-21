import React from 'react';
import { CollarIcon } from './CollarIcon';
import { Button } from './Button';

interface SplashScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export function SplashScreen({ onGetStarted, onSignIn }: SplashScreenProps) {
  return (
    <div 
      className="relative w-[390px] h-[844px] overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, #183F3A 0%, #0F2E2A 70%)`,
      }}
    >
      {/* Subtle linen texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.035
        }}
      />

      {/* Status bar spacer */}
      <div className="h-[47px]" />

      {/* Main content - vertically centered at 45% from top */}
      <div 
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: '45%', transform: 'translateY(-50%)' }}
      >
        {/* Wordmark */}
        <div className="text-center">
          <h1 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              fontWeight: 700,
              color: '#D6B97B',
              letterSpacing: '6px',
              lineHeight: 1
            }}
          >
            RAPIDRY
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A',
              letterSpacing: '4px',
              lineHeight: 1
            }}
          >
            EST.    2026
          </p>
        </div>
      </div>

      {/* Bottom section */}
      <div 
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: '52px' }}
      >
        {/* Primary Button */}
        <Button variant="primary" onClick={onGetStarted}>
          Get Started
        </Button>

        {/* Secondary Link */}
        <div className="text-center mt-3">
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#9CAB9A'
            }}
          >
            Already a member?{' '}
          </span>
          <button
            onClick={onSignIn}
            className="bg-transparent border-none cursor-pointer transition-opacity hover:opacity-80"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#D6B97B',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              padding: 0
            }}
          >
            Sign in →
          </button>
        </div>
      </div>
    </div>
  );
}