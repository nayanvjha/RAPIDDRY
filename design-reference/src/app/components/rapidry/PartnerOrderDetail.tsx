import React, { useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  isCompleted: boolean;
}

export function PartnerOrderDetail() {
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', name: 'Shirt', quantity: 2, isCompleted: true },
    { id: '2', name: 'Trouser', quantity: 1, isCompleted: true },
    { id: '3', name: 'Blazer', quantity: 1, isCompleted: true },
    { id: '4', name: 'Saree', quantity: 1, isCompleted: false }
  ]);

  const [selectedDamageItem, setSelectedDamageItem] = useState('');
  const [damageNotes, setDamageNotes] = useState('');

  const toggleItem = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const completedCount = items.filter(item => item.isCompleted).length;
  const totalCount = items.length;
  const allCompleted = completedCount === totalCount;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div
      style={{
        width: '1024px',
        height: '768px',
        background: '#F3EFE6',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Nav */}
      <header
        className="flex items-center"
        style={{
          height: '64px',
          background: '#0F2E2A',
          padding: '0 24px',
          gap: '16px'
        }}
      >
        {/* Back Arrow */}
        <button
          className="transition-opacity hover:opacity-70"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#F3EFE6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Order Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: '#F3EFE6',
            letterSpacing: '0.2px'
          }}
        >
          Order #RD-24001 — Nishant S.
        </h1>
      </header>

      {/* Two-Column Layout */}
      <div
        className="flex gap-5 flex-1 overflow-hidden"
        style={{
          padding: '24px'
        }}
      >
        {/* LEFT COLUMN - Item Processing */}
        <div style={{ width: '580px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {/* Header */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginBottom: '12px'
              }}
            >
              Items to Process
            </h2>

            {/* Progress */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#4A5568',
                  marginBottom: '8px'
                }}
              >
                {completedCount} of {totalCount} completed
              </div>
              
              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#EAE4D8',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  className="transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    background: '#D6B97B',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>

            {/* Item Rows */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingRight: '4px'
              }}
            >
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="transition-all"
                  style={{
                    background: item.isCompleted ? '#F0FDF4' : index % 2 === 0 ? '#FFFFFF' : '#F3EFE6',
                    border: `1.5px solid ${item.isCompleted ? '#15803D' : '#EAE4D8'}`,
                    borderRadius: '14px',
                    padding: '16px 20px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (!item.isCompleted) {
                      e.currentTarget.style.borderColor = '#D6B97B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.isCompleted) {
                      e.currentTarget.style.borderColor = '#EAE4D8';
                    }
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      border: item.isCompleted ? 'none' : '2px solid #C8BFB3',
                      background: item.isCompleted ? '#0F2E2A' : '#FFFFFF'
                    }}
                  >
                    {item.isCompleted && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Item Name */}
                  <div className="flex-1">
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: item.isCompleted ? '#9CAB9A' : '#0F2E2A',
                        textDecoration: item.isCompleted ? 'line-through' : 'none',
                        display: 'block'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Quantity Badge */}
                  <div
                    style={{
                      background: '#D6B97B',
                      borderRadius: '999px',
                      padding: '6px 16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#0F2E2A',
                      minWidth: '56px',
                      textAlign: 'center'
                    }}
                  >
                    ×{item.quantity}
                  </div>
                </button>
              ))}
            </div>

            {/* Mark Ready Button */}
            <button
              disabled={!allCompleted}
              className="transition-all"
              style={{
                marginTop: '24px',
                width: '100%',
                height: '64px',
                background: allCompleted ? '#0F2E2A' : '#9CAB9A',
                color: '#F3EFE6',
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 700,
                borderRadius: '16px',
                border: 'none',
                cursor: allCompleted ? 'pointer' : 'not-allowed',
                opacity: allCompleted ? 1 : 0.4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                letterSpacing: '0.3px',
                boxShadow: allCompleted ? '0 0 0 3px rgba(214,185,123,0.2), 0 4px 12px rgba(15,46,42,0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (allCompleted) {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={(e) => {
                if (allCompleted) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              <span style={{ fontSize: '22px' }}>✅</span>
              MARK ORDER READY
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Order Info & Damage Report */}
        <div
          style={{
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}
        >
          {/* Order Info Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
              padding: '20px'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginBottom: '16px'
              }}
            >
              Order Details
            </h3>

            {/* Info Rows */}
            <div>
              {/* Service */}
              <div
                style={{
                  height: '48px',
                  borderBottom: '0.5px solid #EAE4D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#9CAB9A'
                  }}
                >
                  Service
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0F2E2A'
                  }}
                >
                  Wash & Iron
                </span>
              </div>

              {/* Picked up */}
              <div
                style={{
                  height: '48px',
                  borderBottom: '0.5px solid #EAE4D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#9CAB9A'
                  }}
                >
                  Picked up
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0F2E2A'
                  }}
                >
                  Today 10:32 AM
                </span>
              </div>

              {/* Special Instructions */}
              <div
                style={{
                  minHeight: '48px',
                  borderBottom: '0.5px solid #EAE4D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#9CAB9A'
                  }}
                >
                  Special instructions
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: '#D6B97B',
                    textAlign: 'right'
                  }}
                >
                  Handle saree with care
                </span>
              </div>

              {/* Customer Note */}
              <div
                style={{
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#9CAB9A'
                  }}
                >
                  Customer note
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#4A5568',
                    textAlign: 'right'
                  }}
                >
                  Please fold neatly.
                </span>
              </div>
            </div>
          </div>

          {/* Damage Flag Section */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
              padding: '20px'
            }}
          >
            {/* Header with Warning Icon */}
            <div
              className="flex items-center gap-2"
              style={{
                marginBottom: '16px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#991B1B'
                }}
              >
                Report Damaged Item
              </h3>
            </div>

            {/* Select Item Dropdown */}
            <select
              value={selectedDamageItem}
              onChange={(e) => setSelectedDamageItem(e.target.value)}
              style={{
                width: '100%',
                height: '52px',
                padding: '0 16px',
                border: '2px solid #EAE4D8',
                borderRadius: '12px',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 400,
                color: selectedDamageItem ? '#0F2E2A' : '#9CAB9A',
                background: '#FFFFFF',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <option value="">Select damaged item...</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (×{item.quantity})
                </option>
              ))}
            </select>

            {/* Camera Button */}
            <button
              className="transition-all hover:bg-[rgba(214,185,123,0.05)]"
              style={{
                width: '100%',
                height: '52px',
                border: '2px dashed #D6B97B',
                borderRadius: '12px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#D6B97B'
                }}
              >
                Take Photo of Damage
              </span>
            </button>

            {/* Notes Textarea */}
            <textarea
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="Describe the damage..."
              style={{
                width: '100%',
                height: '80px',
                padding: '12px 16px',
                border: '1.5px solid #EAE4D8',
                borderRadius: '12px',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 400,
                color: '#0F2E2A',
                background: '#FFFFFF',
                resize: 'none',
                marginBottom: '12px'
              }}
            />

            {/* Submit Button */}
            <button
              className="transition-all hover:bg-[#991B1B]"
              style={{
                width: '100%',
                height: '48px',
                border: '2px solid #991B1B',
                borderRadius: '12px',
                background: 'transparent',
                color: '#991B1B',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#991B1B';
              }}
            >
              Submit Damage Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
