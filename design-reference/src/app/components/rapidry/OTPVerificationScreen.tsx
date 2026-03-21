import React, { useState, useRef, useEffect } from 'react';

interface OTPVerificationScreenProps {
  onBack?: () => void;
  onVerify?: (otp: string) => void;
  phoneNumber?: string;
}

export function OTPVerificationScreen({ 
  onBack, 
  onVerify,
  phoneNumber = '+91 98765 43210' 
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);
    setIsError(false);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Auto-verify when all 6 digits are entered
    if (index === 5 && value) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        // Simulate verification
        setIsVerifying(true);
        setTimeout(() => {
          setIsVerifying(false);
          setIsSuccess(true);
          setTimeout(() => {
            onVerify?.(fullOtp);
          }, 800);
        }, 1000);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      setActiveIndex(5);
    } else {
      inputRefs.current[pastedData.length]?.focus();
      setActiveIndex(pastedData.length);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(60);
    setIsError(false);
    inputRefs.current[0]?.focus();
    setActiveIndex(0);
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsSuccess(true);
        setTimeout(() => {
          onVerify?.(fullOtp);
        }, 800);
      }, 1000);
    }
  };

  const isComplete = otp.every(digit => digit !== '');
  const timerExpired = timeLeft === 0;

  // Circular progress calculation
  const progress = (timeLeft / 60) * 100;
  const circumference = 2 * Math.PI * 12; // radius = 12
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
      <div className="flex items-center px-4 pt-4 pb-2">
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
      </div>

      {/* Main Content */}
      <div className="px-6" style={{ marginTop: '24px' }}>
        {/* Heading */}
        <h1 
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '34px',
            fontWeight: 700,
            color: '#0F2E2A',
            lineHeight: 1.2,
            marginBottom: '12px'
          }}
        >
          Verify your<br />number.
        </h1>

        {/* Subtext */}
        <div className="flex flex-wrap items-baseline gap-2">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              fontWeight: 400,
              color: '#4A5568',
              lineHeight: 1.4
            }}
          >
            Code sent to {phoneNumber}
          </p>
          <button
            onClick={() => onBack?.()}
            className="bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-70"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#D6B97B',
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            Change number
          </button>
        </div>

        {/* OTP Input Boxes */}
        <div 
          className="flex justify-center gap-3"
          style={{ marginTop: '52px' }}
        >
          {otp.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setActiveIndex(index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="text-center outline-none transition-all duration-200"
                style={{
                  width: '44px',
                  height: '56px',
                  borderRadius: '12px',
                  background: (activeIndex === index && !digit) || digit ? 'white' : '#F3EFE6',
                  border: isError 
                    ? '2px solid #991B1B'
                    : activeIndex === index && !digit
                    ? '2px solid #D6B97B'
                    : digit
                    ? '1.5px solid #0F2E2A'
                    : '1.5px solid #C8BFB3',
                  paddingBottom: activeIndex === index && !digit ? '0.5px' : '0',
                  paddingRight: activeIndex === index && !digit ? '0.5px' : '0',
                  boxShadow: activeIndex === index && !digit ? '0 0 0 3px rgba(214,185,123,0.15)' : 'none',
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#0F2E2A',
                  caretColor: '#D6B97B'
                }}
              />
              
              {/* Success checkmark animation */}
              {isSuccess && digit && (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    animation: 'fadeIn 0.3s ease-in',
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M5 13l4 4L19 7" 
                      stroke="#059669" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 20,
                        strokeDashoffset: 20,
                        animation: 'drawCheck 0.4s ease-out forwards',
                        animationDelay: `${index * 0.05}s`
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resend Section */}
        <div 
          className="flex items-center justify-center gap-2"
          style={{ marginTop: '32px' }}
        >
          {!timerExpired ? (
            <>
              {/* Circular countdown indicator */}
              <div className="relative" style={{ width: '24px', height: '24px' }}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24"
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  {/* Background circle */}
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#E8D4A8"
                    strokeWidth="2"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="#D6B97B"
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#9CAB9A'
                }}
              >
                Resend code in 0:{timeLeft.toString().padStart(2, '0')}
              </p>
            </>
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9CAB9A'
              }}
            >
              Didn't receive it?{' '}
              <button
                onClick={handleResend}
                className="bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-70"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#D6B97B'
                }}
              >
                Resend OTP
              </button>
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          className="w-full h-[56px] rounded-[999px] transition-all duration-300 active:scale-[0.98] disabled:scale-100"
          style={{
            marginTop: '52px',
            background: isComplete && !isVerifying ? '#D6B97B' : '#E8D4A8',
            color: isComplete && !isVerifying ? '#0F2E2A' : '#9CAB9A',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '0.2px',
            boxShadow: isComplete && !isVerifying ? '0px 8px 32px rgba(214,185,123,0.30)' : 'none',
            border: 'none',
            cursor: isComplete && !isVerifying ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isVerifying ? (
            <svg 
              className="animate-spin" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="white" 
                strokeWidth="3" 
                strokeOpacity="0.3"
              />
              <path 
                d="M12 2a10 10 0 0 1 10 10" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </svg>
          ) : (
            'Verify & Continue'
          )}
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
