import React, { useState } from 'react';
import logoIcon from 'figma:asset/f90ceb00702b22ff209113e464599d98455b80c7.png';

interface PhoneLoginScreenProps {
  onBack?: () => void;
  onSendOTP?: (phoneNumber: string) => void;
}

export function PhoneLoginScreen({ onBack, onSendOTP }: PhoneLoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  const formatPhoneDisplay = (value: string) => {
    // Format as: 98765 43210
    if (value.length <= 5) return value;
    return `${value.slice(0, 5)} ${value.slice(5)}`;
  };

  const isValid = phoneNumber.length === 10;

  return (
    <div 
      className="relative w-[390px] h-[844px] overflow-hidden"
      style={{
        background: '#F3EFE6',
      }}
    >
      {/* Diagonal linen texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='diagonalTexture' patternUnits='userSpaceOnUse' width='100' height='100' patternTransform='rotate(45)'%3E%3Cline x1='0' y1='0' x2='0' y2='100' stroke='%230F2E2A' stroke-width='0.5' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23diagonalTexture)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.04
        }}
      />

      {/* Status bar spacer */}
      <div className="h-[47px]" />

      {/* Top Navigation */}
      <div className="relative flex items-center justify-between px-4 pt-4 pb-2">
        {/* Back Arrow */}
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center -ml-2 transition-opacity hover:opacity-60"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="#0F2E2A" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <img 
            src={logoIcon} 
            alt="Rapidry" 
            className="w-8 h-8"
          />
        </div>

        {/* Right spacer for balance */}
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="px-6" style={{ marginTop: '56px' }}>
        {/* Heading Block */}
        <div className="mb-[52px]">
          <h1 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '34px',
              fontWeight: 700,
              color: '#0F2E2A',
              lineHeight: 1.2,
              marginBottom: '8px'
            }}
          >
            Welcome.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#4A5568',
              lineHeight: 1.4
            }}
          >
            Enter your mobile number
          </p>
        </div>

        {/* Input Area */}
        <div>
          <div 
            className="flex items-center transition-all duration-200"
            style={{
              height: '56px',
              borderBottom: isFocused 
                ? '2px solid #D6B97B' 
                : '1.5px solid #0F2E2A',
              paddingBottom: isFocused ? '1.5px' : '0px'
            }}
          >
            {/* Country Code Section */}
            <div 
              className="flex items-center gap-2 pr-3"
              style={{
                width: '80px',
                borderRight: '1px solid rgba(15, 46, 42, 0.2)',
                height: '40px'
              }}
            >
              <span style={{ fontSize: '20px' }}>🇮🇳</span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0F2E2A'
                }}
              >
                +91
              </span>
            </div>

            {/* Phone Input */}
            <input
              type="tel"
              inputMode="numeric"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={handlePhoneChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="98765 43210"
              className="flex-1 bg-transparent border-none outline-none pl-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: '#0F2E2A',
                letterSpacing: '1px',
                height: '100%'
              }}
            />
          </div>

          {/* Helper Text */}
          <p
            className="mt-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 400,
              color: '#9CAB9A',
              lineHeight: 1.4
            }}
          >
            We'll send a 6-digit OTP to verify
          </p>
        </div>

        {/* Send OTP Button */}
        <button
          onClick={() => isValid && onSendOTP?.(phoneNumber)}
          disabled={!isValid}
          className="w-full mt-10 h-[56px] rounded-[999px] transition-all duration-300 active:scale-[0.98] disabled:scale-100"
          style={{
            background: isValid ? '#D6B97B' : '#E8D4A8',
            color: isValid ? '#0F2E2A' : '#9CAB9A',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '0.2px',
            boxShadow: isValid ? '0px 8px 32px rgba(214,185,123,0.30)' : 'none',
            border: 'none',
            cursor: isValid ? 'pointer' : 'not-allowed'
          }}
        >
          Send OTP
        </button>
      </div>

      {/* Bottom Terms */}
      <div 
        className="absolute bottom-0 left-0 right-0 text-center"
        style={{ paddingBottom: '32px' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 400,
            color: '#9CAB9A',
            lineHeight: 1.5
          }}
        >
          By continuing, you agree to our{' '}
          <button 
            className="bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#D6B97B'
            }}
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button 
            className="bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#D6B97B'
            }}
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}