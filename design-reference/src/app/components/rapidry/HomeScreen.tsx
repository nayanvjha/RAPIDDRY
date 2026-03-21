import React, { useState } from 'react';

interface HomeScreenProps {
  userName?: string;
  userAvatar?: string;
  hasNotifications?: boolean;
  hasActiveOrder?: boolean;
}

export function HomeScreen({ 
  userName = 'Nishant',
  userAvatar,
  hasNotifications = true,
  hasActiveOrder = true
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'orders' | 'track' | 'profile'>('home');

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#F3EFE6]">
      {/* Header */}
      <div className="px-5 pt-12" style={{ height: '100px' }}>
        <div className="flex items-start justify-between">
          {/* Left stack */}
          <div style={{ gap: '2px', display: 'flex', flexDirection: 'column' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9CAB9A'
              }}
            >
              {getTimeGreeting()},
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F2E2A'
              }}
            >
              {userName}
            </h1>
          </div>

          {/* Right row */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-10 h-10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2E2A" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {hasNotifications && (
                <span
                  className="absolute top-2 right-2"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#D6B97B',
                    border: '1.5px solid #F3EFE6',
                    display: 'block'
                  }}
                />
              )}
            </button>

            {/* Avatar */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: '#0F2E2A' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#D6B97B'
                }}
              >
                N
              </span>
            </div>
          </div>
        </div>

        {/* Location pill */}
        <div className="mt-2">
          <button
            className="inline-flex items-center gap-2 rounded-full"
            style={{
              background: '#0F2E2A',
              padding: '8px 14px',
              height: '34px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#F3EFE6'
              }}
            >
              Sector 66, Gurgaon
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto" style={{ height: 'calc(844px - 100px - 72px)' }}>
        {/* Hero Banner */}
        <div className="px-5" style={{ marginTop: '16px' }}>
          <div
            className="overflow-hidden"
            style={{
              width: '100%',
              height: '200px',
              borderRadius: '18px',
              background: '#0F2E2A',
              padding: '20px'
            }}
          >
            {/* Badge */}
            <div
              className="inline-block rounded-full"
              style={{
                background: 'rgba(214,185,123,0.15)',
                border: '1px solid rgba(214,185,123,0.25)',
                padding: '4px 10px'
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
                Same-day pickup available
              </span>
            </div>

            {/* Heading */}
            <h2
              className="mt-[10px]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.15,
                maxWidth: '220px'
              }}
            >
              Fresh clothes,<br />delivered.
            </h2>

            {/* CTA Button */}
            <button
              className="inline-block mt-3 rounded-full transition-transform active:scale-95"
              style={{
                background: '#D6B97B',
                padding: '8px 16px',
                height: '34px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0F2E2A',
                border: 'none'
              }}
            >
              Book Now →
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="px-5 mt-7">
          {/* Section header */}
          <div className="flex items-center justify-between mb-[14px]">
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#0F2E2A'
              }}
            >
              Services
            </h3>
            <button
              className="transition-opacity hover:opacity-70"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#D6B97B',
                background: 'none',
                border: 'none'
              }}
            >
              See all →
            </button>
          </div>

          {/* Row 1: Two cards */}
          <div className="flex gap-3 mb-3">
            {/* Wash & Fold - Dark card */}
            <div
              className="flex-1 relative"
              style={{
                background: '#0F2E2A',
                borderRadius: '14px',
                padding: '16px',
                height: '160px'
              }}
            >
              {/* Icon */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D6B97B" strokeWidth="1.5">
                <rect x="3" y="2" width="18" height="20" rx="2" />
                <circle cx="12" cy="11" r="4" />
                <path d="M7 2v2M17 2v2" />
              </svg>

              {/* Bottom section */}
              <div className="absolute bottom-4 left-4">
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: '2px'
                  }}
                >
                  Wash & Fold
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#D6B97B'
                  }}
                >
                  ₹49 / kg
                </p>
              </div>
            </div>

            {/* Wash & Iron - White card */}
            <div
              className="flex-1 relative"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EAE4D8',
                borderRadius: '14px',
                padding: '16px',
                height: '160px',
                boxShadow: '0px 2px 8px rgba(15,46,42,0.06)'
              }}
            >
              {/* Icon */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F2E2A" strokeWidth="1.5">
                <path d="M12 18H6a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h12a2 2 0 0 1 2 2v1" />
                <path d="M17 15h5l-1.5 6h-7l-1.5-6h1.5" />
              </svg>

              {/* Bottom section */}
              <div className="absolute bottom-4 left-4">
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '2px'
                  }}
                >
                  Wash & Iron
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#D6B97B'
                  }}
                >
                  ₹79 / kg
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Three cards */}
          <div className="flex gap-[10px]">
            {/* Dry Clean */}
            <div
              className="flex-1 relative"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E8D4A8',
                borderRadius: '14px',
                padding: '12px',
                height: '100px',
                boxShadow: '0px 2px 8px rgba(15,46,42,0.08)'
              }}
            >
              {/* Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2E2A" strokeWidth="1.5">
                <path d="M12 2a3 3 0 0 0-3 3v1" />
                <path d="M3 21h18" />
                <path d="M12 6L3 21" />
                <path d="M12 6l9 15" />
              </svg>

              {/* Bottom section */}
              <div className="absolute bottom-3 left-3">
                <h5
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '2px'
                  }}
                >
                  Dry Clean
                </h5>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D6B97B'
                  }}
                >
                  From ₹199
                </p>
              </div>
            </div>

            {/* Steam Iron */}
            <div
              className="flex-1 relative"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E8D4A8',
                borderRadius: '14px',
                padding: '12px',
                height: '100px',
                boxShadow: '0px 2px 8px rgba(15,46,42,0.08)'
              }}
            >
              {/* Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2E2A" strokeWidth="1.5">
                <path d="M12 18H6a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h12a2 2 0 0 1 2 2v1" />
                <circle cx="8" cy="10" r="1" fill="#0F2E2A" />
                <circle cx="12" cy="10" r="1" fill="#0F2E2A" />
              </svg>

              {/* Bottom section */}
              <div className="absolute bottom-3 left-3">
                <h5
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '2px'
                  }}
                >
                  Steam Iron
                </h5>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D6B97B'
                  }}
                >
                  ₹29/item
                </p>
              </div>
            </div>

            {/* Shoe Care */}
            <div
              className="flex-1 relative"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E8D4A8',
                borderRadius: '14px',
                padding: '12px',
                height: '100px',
                boxShadow: '0px 2px 8px rgba(15,46,42,0.08)'
              }}
            >
              {/* Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F2E2A" strokeWidth="1.5">
                <path d="M2 17l3-3M2 17v4h4" />
                <path d="M22 17l-3-3M22 17v4h-4" />
                <path d="M6 14h12l1-6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2l1 6z" />
              </svg>

              {/* Bottom section */}
              <div className="absolute bottom-3 left-3">
                <h5
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '2px'
                  }}
                >
                  Shoe Care
                </h5>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D6B97B'
                  }}
                >
                  ₹149
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white"
        style={{
          height: '72px',
          borderTop: '1px solid #F0EDE6'
        }}
      >
        <div className="flex items-start justify-around pt-2 px-2">
          {[
            { id: 'home', label: 'Home', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
            { id: 'services', label: 'Services', icon: 'M4 7h16M4 12h16M4 17h16' },
            { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
            { id: 'track', label: 'Track', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
            { id: 'profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex flex-col items-center gap-1 relative"
                style={{ width: '64px' }}
              >
                {isActive && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: '20px',
                      height: '3px',
                      background: '#D6B97B'
                    }}
                  />
                )}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={isActive ? '#0F2E2A' : 'none'}
                  stroke={isActive ? '#0F2E2A' : '#9CAB9A'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={tab.icon} />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0F2E2A' : '#9CAB9A'
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}