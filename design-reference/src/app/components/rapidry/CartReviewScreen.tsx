import React, { useState } from 'react';
import { BottomNavBar } from './BottomNavBar';
import { EmptyState } from './EmptyState';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CartReviewScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  onProceedToPayment?: () => void;
}

export function CartReviewScreen({ onBack, onEdit, onProceedToPayment }: CartReviewScreenProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const cartItems: CartItem[] = [];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const platformFee = 20;
  const discount = appliedPromo?.discount || 0;
  const grandTotal = subtotal - discount + platformFee;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedWeight = 2; // kg

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME20') {
      setAppliedPromo({ code: 'WELCOME20', discount: 67 });
      setPromoCode('');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

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

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 600,
            color: '#0F2E2A'
          }}
        >
          Review Order
        </h1>

        {/* Edit icon */}
        <button 
          onClick={onEdit}
          className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
          aria-label="Edit order"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
              stroke="#D6B97B" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" 
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
          height: 'calc(844px - 100px - 114px - 72px)',
          paddingBottom: '24px'
        }}
      >
        {cartItems.length === 0 ? (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            title="Your cart is empty"
            subtitle="Add services to get started"
            ctaLabel="Browse Services"
            ctaOnClick={() => console.log('Browse Services')}
            variant="light"
          />
        ) : (
          <>
        {/* Order Summary Card */}
        <div className="px-4 mt-4">
          <div
            className="overflow-hidden"
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0px 4px 12px rgba(15,46,42,0.08)'
            }}
          >
            {/* Card header */}
            <div
              style={{
                background: '#0F2E2A',
                padding: '16px 20px'
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '17px',
                  fontWeight: 600,
                  color: '#F3EFE6',
                  marginBottom: '4px'
                }}
              >
                Wash & Iron
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#F3EFE6',
                  opacity: 0.7
                }}
              >
                {totalItems} items · Est. {estimatedWeight} kg
              </p>
            </div>

            {/* Item rows */}
            <div>
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: '0 20px',
                    height: '52px',
                    borderBottom: index < cartItems.length - 1 ? '0.5px solid #F3EFE6' : 'none'
                  }}
                >
                  {/* Item name */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#0F2E2A'
                    }}
                  >
                    {item.name}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Quantity badge */}
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#D6B97B',
                        background: 'rgba(214,185,123,0.12)',
                        padding: '4px 10px',
                        borderRadius: '999px'
                      }}
                    >
                      ×{item.quantity}
                    </span>

                    {/* Price */}
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        minWidth: '60px',
                        textAlign: 'right'
                      }}
                    >
                      ₹{item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal row */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '14px 20px',
                background: 'rgba(243,239,230,0.5)'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#4A5568'
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F2E2A'
                }}
              >
                ₹{subtotal}
              </span>
            </div>
          </div>
        </div>

        {/* Pickup Details Card */}
        <div className="px-4 mt-3">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '0px 2px 8px rgba(15,46,42,0.04)'
            }}
          >
            {/* Pickup time row */}
            <div className="flex items-start gap-3 pb-4 mb-4" style={{ borderBottom: '0.5px solid #F3EFE6' }}>
              {/* Calendar icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#D6B97B" strokeWidth="2"/>
                <path d="M16 2V6M8 2V6M3 10H21" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round"/>
              </svg>

              {/* Time text */}
              <p
                className="flex-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#0F2E2A',
                  lineHeight: 1.4
                }}
              >
                Tuesday, 21 March · 11 AM – 1 PM
              </p>

              {/* Edit button */}
              <button
                className="transition-opacity hover:opacity-70"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#D6B97B',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                Edit
              </button>
            </div>

            {/* Pickup address row */}
            <div className="flex items-start gap-3">
              {/* Location pin icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path 
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
                  stroke="#D6B97B" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
                  stroke="#D6B97B" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>

              {/* Address text */}
              <p
                className="flex-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#0F2E2A',
                  lineHeight: 1.4
                }}
              >
                02-007, Emaar Palm Square, Sector 66
              </p>

              {/* Edit button */}
              <button
                className="transition-opacity hover:opacity-70"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#D6B97B',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="px-4 mt-3">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px'
            }}
          >
            {!appliedPromo ? (
              <div className="flex items-center gap-3">
                {/* Tag icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path 
                    d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41V13.41Z" 
                    stroke="#D6B97B" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path d="M7 7H7.01" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* Label */}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F2E2A'
                  }}
                >
                  Promo code
                </span>

                {/* Input and Apply button */}
                <div className="flex-1 flex items-center justify-end gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="text-right"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#0F2E2A',
                      border: 'none',
                      borderBottom: '1px solid #C8BFB3',
                      background: 'transparent',
                      outline: 'none',
                      padding: '4px 0',
                      width: '100px'
                    }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                    className="transition-opacity"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: promoCode ? '#D6B97B' : '#9CAB9A',
                      background: 'none',
                      border: 'none',
                      cursor: promoCode ? 'pointer' : 'not-allowed',
                      opacity: promoCode ? 1 : 0.6
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Checkmark icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#15803D" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* Applied code text */}
                <span
                  className="flex-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#15803D'
                  }}
                >
                  {appliedPromo.code} applied
                </span>

                {/* Discount amount */}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#15803D'
                  }}
                >
                  −₹{appliedPromo.discount}
                </span>

                {/* Remove button */}
                <button
                  onClick={handleRemovePromo}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#F3EFE6',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: '#4A5568'
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="px-4 mt-3">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px'
            }}
          >
            {/* Service total */}
            <div className="flex items-center justify-between mb-[10px]">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#4A5568'
                }}
              >
                Service total
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F2E2A'
                }}
              >
                ₹{subtotal}
              </span>
            </div>

            {/* Promo discount */}
            {appliedPromo && (
              <div className="flex items-center justify-between mb-[10px]">
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#4A5568'
                  }}
                >
                  Promo discount
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#15803D'
                  }}
                >
                  −₹{appliedPromo.discount}
                </span>
              </div>
            )}

            {/* Platform fee */}
            <div className="flex items-center justify-between mb-4">
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#4A5568'
                }}
              >
                Platform fee
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F2E2A'
                }}
              >
                ₹{platformFee}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#D6B97B', marginBottom: '16px' }} />

            {/* Grand total */}
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#0F2E2A'
                }}
              >
                Grand Total
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0F2E2A'
                }}
              >
                ₹{grandTotal}
              </span>
            </div>

            {/* Disclaimer */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 400,
                color: '#9CAB9A',
                lineHeight: 1.4
              }}
            >
              Final amount may vary based on actual weight.
            </p>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div
        className="absolute bottom-[72px] left-0 right-0"
        style={{
          background: '#FFFFFF',
          boxShadow: '0px -4px 16px rgba(15,46,42,0.06)',
          padding: '16px 24px',
          paddingBottom: '32px'
        }}
      >
        {/* Payment button */}
        <button
          onClick={onProceedToPayment}
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
            boxShadow: '0px 4px 16px rgba(214,185,123,0.3)',
            height: '52px',
            marginBottom: '8px'
          }}
        >
          Proceed to Payment
        </button>

        {/* Security note */}
        <div className="flex items-center justify-center gap-1">
          {/* Lock icon */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CAB9A" strokeWidth="2"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round"/>
          </svg>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A'
            }}
          >
            Secured by Razorpay
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0">
        <BottomNavBar 
          activeTab="orders" 
          onTabChange={(tab) => console.log('Navigate to:', tab)} 
        />
      </div>
    </div>
  );
}