import React, { useState } from 'react';

interface PaymentMethod {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface PaymentConfirmationScreenProps {
  onBack?: () => void;
  onPayment?: (method: string) => void;
}

export function PaymentConfirmationScreen({ onBack, onPayment }: PaymentConfirmationScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Google Pay, PhonePe, BHIM',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M2 10H22" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M7 15H7.01M11 15H13" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      id: 'card',
      name: 'Card',
      description: 'Credit or Debit card',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="4" width="22" height="16" rx="2" stroke="#F3EFE6" strokeWidth="2"/>
          <path d="M1 10H23" stroke="#F3EFE6" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when delivered',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#F3EFE6" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="#F3EFE6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  const handlePayment = () => {
    onPayment?.(selectedMethod);
  };

  return (
    <div 
      className="relative w-[390px] h-[844px] overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center top, rgba(24,63,58,1) 0%, rgba(15,46,42,1) 60%)'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{ 
          height: '100px',
          paddingTop: '47px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
      >
        {/* Back arrow */}
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="#F3EFE6" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 600,
            color: '#F3EFE6'
          }}
        >
          Secure Checkout
        </h1>

        {/* Lock icon */}
        <div className="w-10 h-10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#D6B97B" strokeWidth="2"/>
            <path 
              d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" 
              stroke="#D6B97B" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: 'calc(844px - 100px - 140px)',
          paddingBottom: '24px'
        }}
      >
        {/* Order Summary - Glassmorphism Card */}
        <div className="px-4 mt-6">
          <div
            style={{
              background: 'rgba(243,239,230,0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(214,185,123,0.20)',
              borderRadius: '20px',
              padding: '20px'
            }}
          >
            {/* Service and items */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.7,
                marginBottom: '8px'
              }}
            >
              Wash & Iron · 3 items
            </p>

            {/* Total amount */}
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '44px',
                fontWeight: 700,
                color: '#D6B97B',
                lineHeight: 1.1,
                marginBottom: '4px'
              }}
            >
              ₹289
            </p>

            {/* Fee note */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.5,
                marginBottom: '16px'
              }}
            >
              including platform fee
            </p>

            {/* Gold divider */}
            <div 
              style={{
                height: '1px',
                background: 'rgba(214,185,123,0.25)',
                marginBottom: '16px'
              }}
            />

            {/* Pickup info row */}
            <div className="flex items-center gap-2">
              {/* Calendar icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#F3EFE6" strokeWidth="2" opacity="0.7"/>
                <path d="M16 2V6M8 2V6M3 10H21" stroke="#F3EFE6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
              </svg>

              {/* Pickup time text */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#F3EFE6',
                  opacity: 0.7
                }}
              >
                Tue 21 Mar · 11AM–1PM
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="px-4 mt-6">
          {/* Section label */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#F3EFE6',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}
          >
            Pay with
          </p>

          {/* Payment option cards */}
          <div className="space-y-[10px]">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className="w-full flex items-center gap-3 transition-all active:scale-98"
                  style={{
                    background: isSelected 
                      ? 'rgba(214,185,123,0.12)' 
                      : 'rgba(243,239,230,0.06)',
                    border: isSelected 
                      ? '2px solid #D6B97B' 
                      : '1.5px solid rgba(214,185,123,0.12)',
                    borderRadius: '14px',
                    padding: '16px 18px',
                    height: '64px',
                    cursor: 'pointer',
                    boxShadow: isSelected 
                      ? '0px 4px 16px rgba(214,185,123,0.15)' 
                      : 'none'
                  }}
                >
                  {/* Method icon */}
                  <div style={{ flexShrink: 0 }}>
                    {method.icon}
                  </div>

                  {/* Method name and description */}
                  <div className="flex-1 text-left">
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#F3EFE6',
                        lineHeight: 1.2,
                        marginBottom: '2px'
                      }}
                    >
                      {method.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#F3EFE6',
                        opacity: 0.5
                      }}
                    >
                      {method.description}
                    </p>
                  </div>

                  {/* Radio button */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#D6B97B' : 'rgba(243,239,230,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#D6B97B'
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          padding: '24px',
          paddingBottom: '32px'
        }}
      >
        {/* Payment button */}
        <button
          onClick={handlePayment}
          className="w-full rounded-full transition-all active:scale-98"
          style={{
            background: '#D6B97B',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: 'pointer',
            boxShadow: '0px 8px 32px rgba(214,185,123,0.30)',
            height: '56px',
            marginBottom: '12px'
          }}
        >
          Pay ₹289 Securely
        </button>

        {/* Security note */}
        <p
          className="text-center"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 400,
            color: '#F3EFE6',
            opacity: 0.4,
            lineHeight: 1.4
          }}
        >
          🔒 256-bit encrypted · PCI DSS compliant
        </p>
      </div>
    </div>
  );
}
