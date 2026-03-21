import React, { useState } from 'react';

interface Item {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

interface AgentVerifyItemsScreenProps {
  onBack?: () => void;
  onConfirm?: (items: Item[], photo: boolean) => void;
  onCapture?: () => void;
}

export function AgentVerifyItemsScreen({
  onBack,
  onConfirm,
  onCapture
}: AgentVerifyItemsScreenProps) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Shirt', quantity: 2, checked: true },
    { id: '2', name: 'Trouser', quantity: 1, checked: true },
    { id: '3', name: 'Blazer', quantity: 1, checked: false },
    { id: '4', name: 'Suit', quantity: 0, checked: false }
  ]);
  const [photoTaken, setPhotoTaken] = useState(false);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCapture = () => {
    setPhotoTaken(true);
    onCapture?.();
  };

  const handleRetake = () => {
    setPhotoTaken(false);
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;
  const progress = (checkedCount / totalCount) * 100;
  const allItemsChecked = checkedCount === totalCount;
  const canConfirm = allItemsChecked && photoTaken;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm?.(items, photoTaken);
    }
  };

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#0F2E2A]">
      {/* Top Bar */}
      <div
        className="relative z-20 flex items-center justify-between"
        style={{
          paddingTop: '47px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px'
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="#F3EFE6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: '#F3EFE6'
            }}
          >
            Verify Items
          </h1>
        </button>

        {/* Step indicator */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 400,
            color: '#9CAB9A'
          }}
        >
          Step 2 of 3
        </p>
      </div>

      {/* Scrollable content */}
      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(844px - 95px - 88px)'
        }}
      >
        {/* Instruction Card */}
        <div className="px-4 mt-4">
          <div
            className="flex gap-3"
            style={{
              background: 'rgba(214,185,123,0.08)',
              border: '1px solid #D6B97B',
              borderRadius: '14px',
              padding: '14px 16px'
            }}
          >
            {/* Info icon */}
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" stroke="#D6B97B" strokeWidth="2"/>
              <path d="M12 16V12" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="0.5" fill="#D6B97B" stroke="#D6B97B" strokeWidth="1"/>
            </svg>

            {/* Instruction text */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                lineHeight: 1.5
              }}
            >
              Count each item and photograph them before pickup.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 mt-4">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#F3EFE6',
              marginBottom: '8px'
            }}
          >
            {checkedCount} of {totalCount} items verified
          </p>

          {/* Progress track */}
          <div
            style={{
              background: '#183F3A',
              borderRadius: '999px',
              height: '6px',
              overflow: 'hidden'
            }}
          >
            {/* Progress fill */}
            <div
              className="transition-all duration-300"
              style={{
                background: '#D6B97B',
                borderRadius: '999px',
                height: '100%',
                width: `${progress}%`
              }}
            />
          </div>
        </div>

        {/* Item Checklist */}
        <div className="px-4 mt-5 space-y-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center gap-3 transition-all active:scale-98"
              style={{
                background: '#183F3A',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 16px',
                minHeight: '64px',
                cursor: 'pointer',
                opacity: item.checked ? 0.6 : 1,
                textDecoration: item.checked ? 'line-through' : 'none'
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  border: item.checked ? 'none' : '1.5px solid #334D47',
                  background: item.checked ? '#D6B97B' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {item.checked && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Item info */}
              <div className="flex-1 flex items-center gap-2">
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#F3EFE6'
                  }}
                >
                  {item.name}
                </p>

                {/* Quantity badge */}
                {item.quantity > 0 && (
                  <div
                    style={{
                      background: '#D6B97B',
                      borderRadius: '999px',
                      padding: '2px 8px'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#0F2E2A'
                      }}
                    >
                      ×{item.quantity}
                    </span>
                  </div>
                )}
              </div>

              {/* Checkmark indicator */}
              {item.checked && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#D6B97B" opacity="0.2"/>
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#D6B97B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Photo Capture Area */}
        <div className="px-4 mt-6">
          <div
            style={{
              background: '#183F3A',
              borderRadius: '20px',
              padding: '20px'
            }}
          >
            {!photoTaken ? (
              // State 1: No photo
              <button
                onClick={handleCapture}
                className="w-full flex flex-col items-center justify-center gap-3 transition-all active:scale-98"
                style={{
                  background: 'transparent',
                  border: '2px dashed rgba(214,185,123,0.30)',
                  borderRadius: '14px',
                  height: '160px',
                  cursor: 'pointer'
                }}
              >
                {/* Camera icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H7L9 3H15L17 6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V19Z"
                    stroke="#D6B97B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="13" r="4" stroke="#D6B97B" strokeWidth="2"/>
                </svg>

                {/* Instruction text */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#F3EFE6',
                    opacity: 0.6
                  }}
                >
                  Tap to photograph items
                </p>
              </button>
            ) : (
              // State 2: Photo taken
              <div className="relative">
                {/* Photo thumbnail (simulated with gradient) */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #2A4F4A 0%, #1A3F3A 100%)',
                    borderRadius: '14px',
                    height: '160px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Simulated photo content */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(15,46,42,0.3), rgba(15,46,42,0.8))'
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H7L9 3H15L17 6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V19Z"
                        stroke="#F3EFE6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                      />
                      <circle cx="12" cy="13" r="4" stroke="#F3EFE6" strokeWidth="1.5" opacity="0.3"/>
                    </svg>
                  </div>

                  {/* Checkmark overlay */}
                  <div
                    className="absolute top-3 right-3"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#D6B97B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.4)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#0F2E2A"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Retake button */}
                <button
                  onClick={handleRetake}
                  className="w-full mt-3 transition-opacity hover:opacity-70"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#D6B97B',
                    textAlign: 'center'
                  }}
                >
                  Retake
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom padding for sticky button */}
        <div style={{ height: '24px' }} />
      </div>

      {/* Sticky Bottom Confirm Button */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          background: '#0F2E2A',
          borderTop: '1px solid rgba(24,63,58,0.5)',
          padding: '16px',
          paddingBottom: '32px'
        }}
      >
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="w-full rounded-full transition-all"
          style={{
            background: canConfirm ? '#D6B97B' : '#E8D4A8',
            border: 'none',
            height: '56px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: canConfirm ? 'pointer' : 'not-allowed',
            boxShadow: canConfirm ? '0px 8px 32px rgba(214,185,123,0.30)' : 'none',
            opacity: canConfirm ? 1 : 0.7
          }}
        >
          Confirm Pickup
        </button>
      </div>
    </div>
  );
}
