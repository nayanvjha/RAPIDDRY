import React from 'react';

interface AgentTaskDetailScreenProps {
  onBack?: () => void;
  onCallCustomer?: () => void;
  onMarkArrived?: () => void;
  onOpenMaps?: () => void;
}

export function AgentTaskDetailScreen({
  onBack,
  onCallCustomer,
  onMarkArrived,
  onOpenMaps
}: AgentTaskDetailScreenProps) {
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
            Pickup Task
          </h1>
        </button>

        {/* Status pill */}
        <div
          style={{
            background: '#D6B97B',
            borderRadius: '999px',
            padding: '5px 12px'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#0F2E2A',
              letterSpacing: '0.3px'
            }}
          >
            In Progress
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(844px - 95px)'
        }}
      >
        {/* Map Area */}
        <div
          className="relative"
          style={{
            height: '240px',
            width: '100%',
            background: 'linear-gradient(135deg, #0A1F1C 0%, #15312D 100%)',
            overflow: 'hidden'
          }}
        >
          {/* Simulated map background with grid */}
          <svg
            width="390"
            height="240"
            viewBox="0 0 390 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Map grid lines */}
            <g opacity="0.1">
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="240"
                  stroke="#F3EFE6"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 40}
                  x2="390"
                  y2={i * 40}
                  stroke="#F3EFE6"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Roads simulation */}
            <path
              d="M 0 80 L 150 80 L 150 160 L 300 160"
              stroke="#060F0D"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M 120 0 L 120 100 L 240 100 L 240 240"
              stroke="#060F0D"
              strokeWidth="6"
              fill="none"
            />

            {/* Park areas (dark green) */}
            <circle cx="80" cy="50" r="25" fill="#0F2E2A" opacity="0.6" />
            <rect x="280" y="40" width="70" height="50" rx="8" fill="#0F2E2A" opacity="0.6" />

            {/* Dashed route line (gold) */}
            <path
              d="M 120 200 Q 180 150 240 120"
              stroke="#D6B97B"
              strokeWidth="3"
              strokeDasharray="8 6"
              fill="none"
              opacity="0.8"
            />

            {/* Agent location (blue dot with pulse) */}
            <g>
              <circle cx="120" cy="200" r="12" fill="#3B82F6" opacity="0.3">
                <animate
                  attributeName="r"
                  values="12;18;12"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="120" cy="200" r="6" fill="#3B82F6" />
              <circle cx="120" cy="200" r="3" fill="#FFFFFF" />
            </g>

            {/* Destination pin (gold teardrop) */}
            <g>
              {/* Pin shadow */}
              <ellipse cx="242" cy="125" rx="8" ry="3" fill="#000000" opacity="0.3" />
              
              {/* Gold pin */}
              <path
                d="M 240 100 C 232 100 225 107 225 115 C 225 125 240 135 240 135 C 240 135 255 125 255 115 C 255 107 248 100 240 100 Z"
                fill="#D6B97B"
                stroke="#0F2E2A"
                strokeWidth="1.5"
              />
              
              {/* Pin center (collar icon simplified) */}
              <circle cx="240" cy="115" r="5" fill="#0F2E2A" />
              <path
                d="M 238 113 L 240 116 L 242 113"
                stroke="#D6B97B"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>

          {/* Open in Maps button */}
          <button
            onClick={onOpenMaps}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 transition-all active:scale-95"
            style={{
              background: 'rgba(15,46,42,0.90)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(214,185,123,0.30)',
              borderRadius: '999px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            {/* Map icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z"
                stroke="#D6B97B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 2V18M16 6V22" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#D6B97B'
              }}
            >
              Open in Maps
            </span>
          </button>
        </div>

        {/* Customer Detail Card - Overlapping map */}
        <div className="px-4" style={{ marginTop: '-20px', position: 'relative', zIndex: 10 }}>
          <div
            style={{
              background: '#183F3A',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0px 10px 40px rgba(0,0,0,0.4), 0px 4px 16px rgba(0,0,0,0.3)'
            }}
          >
            {/* Customer name */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#F3EFE6',
                marginBottom: '8px',
                lineHeight: 1.3
              }}
            >
              Mr. Nishant Sarawgi
            </h2>

            {/* Address */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.7,
                lineHeight: 1.5,
                marginBottom: '12px'
              }}
            >
              02-007, Emaar Palm Square,<br />
              Sector 66, Golf Course Ext Road
            </p>

            {/* Distance row with call button */}
            <div className="flex items-center justify-between">
              {/* Distance info */}
              <div className="flex items-center gap-2">
                {/* Location pin icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                    stroke="#D6B97B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="3" stroke="#D6B97B" strokeWidth="2" />
                </svg>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#D6B97B'
                  }}
                >
                  1.2 km away
                </p>
              </div>

              {/* Call button */}
              <button
                onClick={onCallCustomer}
                className="transition-all active:scale-95"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(214,185,123,0.15)',
                  border: '1px solid #D6B97B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {/* Phone icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                    stroke="#D6B97B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Items Reminder */}
        <div className="px-4 mt-4">
          <div
            style={{
              background: 'rgba(214,185,123,0.08)',
              border: '1px solid rgba(214,185,123,0.20)',
              borderRadius: '14px',
              padding: '14px 16px'
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#D6B97B',
                marginBottom: '4px'
              }}
            >
              Collect 4 items:
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.7,
                lineHeight: 1.5
              }}
            >
              Shirt ×2, Trouser ×1, Blazer ×1
            </p>
          </div>
        </div>

        {/* Bottom padding for sticky buttons */}
        <div style={{ height: '160px' }} />
      </div>

      {/* Sticky Bottom Actions */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          background: '#0F2E2A',
          borderTop: '1px solid rgba(24,63,58,0.5)',
          padding: '16px',
          paddingBottom: '32px'
        }}
      >
        {/* Mark as Arrived button */}
        <button
          onClick={onMarkArrived}
          className="w-full rounded-full transition-all active:scale-98 mb-3"
          style={{
            background: '#D6B97B',
            border: 'none',
            height: '56px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0F2E2A',
            cursor: 'pointer',
            boxShadow: '0px 8px 32px rgba(214,185,123,0.30)'
          }}
        >
          Mark as Arrived
        </button>

        {/* Call Customer button */}
        <button
          onClick={onCallCustomer}
          className="w-full rounded-full transition-all active:scale-98"
          style={{
            background: 'transparent',
            border: '2px solid #F3EFE6',
            height: '52px',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 600,
            color: '#F3EFE6',
            cursor: 'pointer'
          }}
        >
          Call Customer
        </button>
      </div>
    </div>
  );
}
