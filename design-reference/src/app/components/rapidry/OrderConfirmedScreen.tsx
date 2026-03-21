import React from 'react';

interface OrderConfirmedScreenProps {
  orderId?: string;
  service?: string;
  itemCount?: number;
  amount?: number;
  paymentMethod?: string;
  pickupSlot?: string;
  estimatedReturn?: string;
  onTrackOrder?: () => void;
  onBackToHome?: () => void;
}

export function OrderConfirmedScreen({
  orderId = 'RD-24001',
  service = 'Wash & Iron',
  itemCount = 3,
  amount = 289,
  paymentMethod = 'UPI',
  pickupSlot = 'Tue, 21 March · 11AM–1PM',
  estimatedReturn = 'Thu, 23 March',
  onTrackOrder,
  onBackToHome
}: OrderConfirmedScreenProps) {
  return (
    <div
      style={{
        width: '390px',
        height: '844px',
        background: '#F3EFE6',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Status Bar Spacer */}
      <div style={{ height: '47px' }} />

      {/* Main Content - Vertically centered in upper 60% */}
      <div style={{ marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Success Animation */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            background: 'rgba(21,128,61,0.08)',
            border: '2px solid rgba(21,128,61,0.20)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Inner Circle */}
          <div
            style={{
              width: '72px',
              height: '72px',
              background: '#15803D',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Checkmark SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            marginTop: '24px',
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 700,
            color: '#0F2E2A',
            textAlign: 'center'
          }}
        >
          Order Confirmed!
        </h1>

        {/* Subtext */}
        <p
          style={{
            marginTop: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 400,
            color: '#64748B',
            textAlign: 'center',
            paddingLeft: '32px',
            paddingRight: '32px'
          }}
        >
          Your pickup is scheduled. We will see you soon.
        </p>

        {/* Order ID Pill */}
        <div
          style={{
            marginTop: '20px',
            background: '#0F2E2A',
            borderRadius: '999px',
            padding: '10px 24px'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#D6B97B'
            }}
          >
            Order #{orderId}
          </span>
        </div>

        {/* Order Summary Card */}
        <div
          style={{
            marginTop: '28px',
            marginLeft: '16px',
            marginRight: '16px',
            width: 'calc(100% - 32px)',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-elevation-2)',
            padding: '18px 20px'
          }}
        >
          {/* Row 1: Pickup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              gap: '12px'
            }}
          >
            {/* Calendar Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#D6B97B" strokeWidth="2" />
              <path d="M16 2V6M8 2V6M3 10H21" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#64748B',
                flex: '0 0 auto'
              }}
            >
              Pickup
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginLeft: 'auto',
                textAlign: 'right'
              }}
            >
              {pickupSlot}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#F3EFE6', margin: '0 -20px' }} />

          {/* Row 2: Service */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              gap: '12px'
            }}
          >
            {/* Package Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 9.4L7.5 4.21M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#64748B',
                flex: '0 0 auto'
              }}
            >
              Service
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginLeft: 'auto',
                textAlign: 'right'
              }}
            >
              {service} · {itemCount} items
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#F3EFE6', margin: '0 -20px' }} />

          {/* Row 3: Paid */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              gap: '12px'
            }}
          >
            {/* Rupee/Card Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="22" height="16" rx="2" stroke="#D6B97B" strokeWidth="2" />
              <path d="M1 10H23" stroke="#D6B97B" strokeWidth="2" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#64748B',
                flex: '0 0 auto'
              }}
            >
              Paid
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginLeft: 'auto',
                textAlign: 'right'
              }}
            >
              ₹{amount} via {paymentMethod}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#F3EFE6', margin: '0 -20px' }} />

          {/* Row 4: Estimated Return */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '44px',
              gap: '12px'
            }}
          >
            {/* Clock Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#D6B97B" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#64748B',
                flex: '0 0 auto'
              }}
            >
              Estimated return
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginLeft: 'auto',
                textAlign: 'right'
              }}
            >
              {estimatedReturn}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Pinned */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Primary Button */}
        <button
          onClick={onTrackOrder}
          style={{
            width: '100%',
            height: '56px',
            background: '#D6B97B',
            borderRadius: '999px',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-elevation-gold)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Track My Order
        </button>

        {/* Secondary Link */}
        <button
          onClick={onBackToHome}
          style={{
            marginTop: '14px',
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9CAB9A',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
