import React, { useState } from 'react';
import { BottomNavBar } from './BottomNavBar';

interface TrackingStep {
  id: string;
  title: string;
  status: 'completed' | 'active' | 'upcoming';
  timestamp?: string;
  agentInfo?: string;
  locationInfo?: string;
  statusLabel?: string;
}

interface OrderTrackingScreenProps {
  onBack?: () => void;
  onSupport?: () => void;
  onHelp?: () => void;
}

export function OrderTrackingScreen({ onBack, onSupport, onHelp }: OrderTrackingScreenProps) {
  const steps: TrackingStep[] = [
    {
      id: '1',
      title: 'Order Placed',
      status: 'completed',
      timestamp: 'Today, 9:15 AM'
    },
    {
      id: '2',
      title: 'Picked Up',
      status: 'completed',
      timestamp: 'Today, 10:42 AM',
      agentInfo: 'Agent Ravi P.'
    },
    {
      id: '3',
      title: 'Processing',
      status: 'active',
      statusLabel: '⚡ In progress',
      locationInfo: 'Suresh Laundry, Koramangala'
    },
    {
      id: '4',
      title: 'Out for Delivery',
      status: 'upcoming'
    },
    {
      id: '5',
      title: 'Delivered',
      status: 'upcoming'
    }
  ];

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#F3EFE6]">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 bg-[#F3EFE6] flex items-center justify-between"
        style={{ 
          height: '100px',
          paddingTop: '47px',
          paddingLeft: '16px',
          paddingRight: '16px',
          borderBottom: '1px solid rgba(15,46,42,0.08)'
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
              stroke="#0F2E2A" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Order number */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 600,
            color: '#0F2E2A'
          }}
        >
          Order #RD-240001
        </h1>

        {/* Support icon */}
        <button 
          onClick={onSupport}
          className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
          aria-label="Contact support"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" 
              stroke="#D6B97B" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: 'calc(844px - 100px - 72px)',
          paddingBottom: '24px'
        }}
      >
        {/* Status Headline */}
        <div className="px-6 mt-6">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: '#0F2E2A',
              lineHeight: 1.2,
              marginBottom: '8px'
            }}
          >
            Your order is being{'\n'}processed.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 400,
              color: '#D6B97B'
            }}
          >
            Estimated delivery: Tomorrow, 10 AM – 12 PM
          </p>
        </div>

        {/* Timeline Tracker */}
        <div className="px-6 mt-9">
          <div className="relative">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isUpcoming = step.status === 'upcoming';

              return (
                <div key={step.id} className="relative flex gap-4" style={{ minHeight: isLast ? 'auto' : '80px' }}>
                  {/* Timeline line and circle */}
                  <div className="relative flex flex-col items-center" style={{ width: '24px' }}>
                    {/* Circle */}
                    <div
                      className="relative flex items-center justify-center z-10"
                      style={{
                        width: isActive ? '24px' : '20px',
                        height: isActive ? '24px' : '20px',
                        borderRadius: '50%',
                        background: isCompleted 
                          ? '#D6B97B' 
                          : isActive 
                            ? '#FFFFFF' 
                            : '#F3EFE6',
                        border: isCompleted 
                          ? 'none' 
                          : isActive 
                            ? '2.5px solid #D6B97B' 
                            : '1.5px solid #C8BFB3',
                        flexShrink: 0
                      }}
                    >
                      {/* Checkmark for completed */}
                      {isCompleted && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M20 6L9 17L4 12" 
                            stroke="#FFFFFF" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      
                      {/* Pulsing dot for active */}
                      {isActive && (
                        <div
                          className="animate-pulse"
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#D6B97B'
                          }}
                        />
                      )}
                    </div>

                    {/* Connecting line */}
                    {!isLast && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          marginTop: '4px',
                          marginBottom: '4px',
                          background: (isCompleted || isActive) ? '#D6B97B' : '#C8BFB3',
                          borderStyle: (isCompleted || isActive) ? 'solid' : 'dashed'
                        }}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pb-6">
                    {/* Title and timestamp */}
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '15px',
                          fontWeight: isUpcoming ? 400 : 600,
                          color: isUpcoming ? '#9CAB9A' : '#0F2E2A'
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Timestamp for completed steps */}
                    {step.timestamp && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#9CAB9A',
                          marginBottom: step.agentInfo ? '4px' : '0'
                        }}
                      >
                        {step.agentInfo ? `${step.agentInfo} · ${step.timestamp}` : step.timestamp}
                      </p>
                    )}

                    {/* Status pill for active step */}
                    {step.statusLabel && (
                      <div
                        className="inline-flex items-center mb-2"
                        style={{
                          background: 'rgba(214,185,123,0.15)',
                          border: '1px solid rgba(214,185,123,0.30)',
                          borderRadius: '999px',
                          padding: '3px 8px'
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#D6B97B'
                          }}
                        >
                          {step.statusLabel}
                        </span>
                      </div>
                    )}

                    {/* Location card for active step */}
                    {step.locationInfo && (
                      <div
                        className="flex items-center gap-2 mt-2"
                        style={{
                          background: 'rgba(243,239,230,0.5)',
                          border: '1px solid #EAE4D8',
                          borderRadius: '10px',
                          padding: '10px 12px'
                        }}
                      >
                        {/* Map pin icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                          <path 
                            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
                            stroke="#4A5568" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                          <path 
                            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                            stroke="#4A5568" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>

                        {/* Location text */}
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#4A5568'
                          }}
                        >
                          {step.locationInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Timeline Card */}
        <div className="px-4 mt-7">
          <div
            style={{
              background: '#0F2E2A',
              borderRadius: '16px',
              padding: '18px 20px'
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.6,
                marginBottom: '4px'
              }}
            >
              Expected Delivery
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#F3EFE6',
                marginBottom: '4px'
              }}
            >
              Tomorrow, 21 March
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 400,
                color: '#D6B97B'
              }}
            >
              10:00 AM – 12:00 PM
            </p>
          </div>
        </div>

        {/* Help Link */}
        <div className="px-4 mt-6 pb-6">
          <button
            onClick={onHelp}
            className="w-full transition-opacity hover:opacity-70"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#D6B97B',
                textDecoration: 'underline'
              }}
            >
              Need help with this order?
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <BottomNavBar 
          activeTab="track" 
          onTabChange={(tab) => console.log('Navigate to:', tab)} 
        />
      </div>
    </div>
  );
}