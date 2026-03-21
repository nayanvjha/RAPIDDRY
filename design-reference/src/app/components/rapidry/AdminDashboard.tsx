import React, { useState } from 'react';

// For React Native export: Save this as logo-light.png
import logoLight from 'figma:asset/35f760095b7ec0e7f2f8193910c32d87fbed5934.png';

interface Order {
  id: string;
  customer: string;
  service: string;
  agent: string | null;
  status: 'Placed' | 'Processing' | 'Delivered' | 'Cancelled';
  amount: number;
}

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeFilter, setActiveFilter] = useState('All');

  const orders: Order[] = [
    { id: '#RD-2847', customer: 'Nishant Sarawgi', service: 'Wash & Iron', agent: 'Ravi Kumar', status: 'Processing', amount: 640 },
    { id: '#RD-2845', customer: 'Priya Sharma', service: 'Dry Cleaning', agent: 'Amit Singh', status: 'Processing', amount: 1240 },
    { id: '#RD-2844', customer: 'Rahul Verma', service: 'Wash & Fold', agent: null, status: 'Placed', amount: 480 },
    { id: '#RD-2843', customer: 'Anjali Gupta', service: 'Premium Care', agent: 'Ravi Kumar', status: 'Delivered', amount: 2180 },
    { id: '#RD-2842', customer: 'Vikram Mehta', service: 'Express Wash', agent: null, status: 'Placed', amount: 820 },
    { id: '#RD-2841', customer: 'Sneha Patel', service: 'Dry Cleaning', agent: 'Suresh Das', status: 'Processing', amount: 1560 },
    { id: '#RD-2840', customer: 'Arjun Reddy', service: 'Wash & Iron', agent: null, status: 'Placed', amount: 720 }
  ];

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', section: 'MAIN' },
    { name: 'Orders', icon: 'orders', section: 'MAIN' },
    { name: 'Agents', icon: 'agents', section: 'MAIN' },
    { name: 'Partners', icon: 'partners', section: 'MAIN' },
    { name: 'Customers', icon: 'customers', section: 'MANAGE' },
    { name: 'Analytics', icon: 'analytics', section: 'MANAGE' },
    { name: 'Coupons', icon: 'coupons', section: 'MANAGE' },
    { name: 'Settings', icon: 'settings', section: 'SYSTEM' }
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Placed':
        return {
          background: 'rgba(214,185,123,0.12)',
          color: '#D6B97B',
          border: '1px solid #D6B97B'
        };
      case 'Processing':
        return {
          background: '#EFF6FF',
          color: '#1D4ED8',
          border: '1px solid #93C5FD'
        };
      case 'Delivered':
        return {
          background: '#F0FDF4',
          color: '#15803D',
          border: '1px solid #86EFAC'
        };
      case 'Cancelled':
        return {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FCA5A5'
        };
      default:
        return {
          background: '#F3F4F6',
          color: '#6B7280',
          border: '1px solid #D1D5DB'
        };
    }
  };

  const getNavIcon = (iconName: string, isActive: boolean) => {
    const color = isActive ? '#D6B97B' : '#9CAB9A';
    
    switch (iconName) {
      case 'dashboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2"/>
          </svg>
        );
      case 'orders':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2"/>
            <path d="M9 12H15M9 16H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'agents':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'partners':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'customers':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
          </svg>
        );
      case 'analytics':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 14L12 9L16 13L21 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12V8H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'coupons':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6.5" cy="6.5" r="1.5" fill={color}/>
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getKPIIcon = (type: string) => {
    switch (type) {
      case 'orders':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="#0F2E2A" strokeWidth="2"/>
            <path d="M9 12H15M9 16H15" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'agents':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#0F2E2A" strokeWidth="2"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'revenue':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#0F2E2A" strokeWidth="2"/>
            <path d="M12 6V18M15 9H10.5C10.1022 9 9.72064 9.15804 9.43934 9.43934C9.15804 9.72064 9 10.1022 9 10.5C9 10.8978 9.15804 11.2794 9.43934 11.5607C9.72064 11.842 10.1022 12 10.5 12H13.5C13.8978 12 14.2794 12.158 14.5607 12.4393C14.842 12.7206 15 13.1022 15 13.5C15 13.8978 14.842 14.2794 14.5607 14.5607C14.2794 14.842 13.8978 15 13.5 15H9" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pending':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#0F2E2A" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[900px] w-[1440px] bg-[#F7F5F0]">
      {/* Left Sidebar */}
      <aside
        className="w-[240px] h-full flex flex-col"
        style={{
          background: '#0F2E2A'
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px' }}>
          <img 
            src={logoLight} 
            alt="Rapidry" 
            style={{ 
              height: '24px',
              marginBottom: '4px'
            }} 
          />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A'
            }}
          >
            Admin Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {['MAIN', 'MANAGE', 'SYSTEM'].map((section) => (
            <div key={section}>
              {/* Section label */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#9CAB9A',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  padding: '24px 20px 8px'
                }}
              >
                {section}
              </div>

              {/* Nav items */}
              {navItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const isActive = activeNav === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveNav(item.name)}
                      className="w-full flex items-center gap-3 transition-all relative group"
                      style={{
                        background: isActive ? 'rgba(214,185,123,0.12)' : 'transparent',
                        margin: '2px 8px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(243,239,230,0.06)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {/* Active bar */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                          style={{ background: '#D6B97B' }}
                        />
                      )}

                      {/* Icon */}
                      <span
                        style={{
                          fontSize: '18px',
                          filter: isActive ? 'grayscale(0)' : 'grayscale(100%) opacity(60%)'
                        }}
                      >
                        {getNavIcon(item.icon, isActive)}
                      </span>

                      {/* Text */}
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: isActive ? 600 : 400,
                          color: '#F3EFE6',
                          opacity: isActive ? 1 : 0.7
                        }}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div
          className="flex items-center gap-3 border-t"
          style={{
            padding: '20px 16px',
            borderTopColor: 'rgba(243,239,230,0.10)'
          }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#D6B97B',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F2E2A'
            }}
          >
            NK
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#F3EFE6',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Nayan Kumar
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 400,
                color: '#9CAB9A'
              }}
            >
              Super Admin
            </p>
          </div>

          {/* Logout icon */}
          <button
            className="transition-opacity hover:opacity-70"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="#9CAB9A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="#9CAB9A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M21 12H9" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between border-b"
          style={{
            height: '64px',
            padding: '0 32px',
            background: '#FFFFFF',
            borderBottomColor: '#EAE4D8'
          }}
        >
          {/* Left */}
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 600,
                color: '#0F2E2A',
                marginBottom: '2px'
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#9CAB9A'
              }}
            >
              Friday, 20 March 2026
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" stroke="#9CAB9A" strokeWidth="2" />
                <path d="M21 21L16.65 16.65" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="transition-all focus:outline-none focus:ring-2 focus:ring-[#D6B97B]"
                style={{
                  width: '200px',
                  height: '36px',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  background: '#F7F5F0',
                  border: '1px solid #EAE4D8',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#0F2E2A'
                }}
              />
            </div>

            {/* Notifications */}
            <button
              className="relative transition-opacity hover:opacity-70"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="#0F2E2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Badge */}
              <span
                className="absolute -top-1 -right-1"
                style={{
                  background: '#991B1B',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-body)'
                }}
              >
                3
              </span>
            </button>

            {/* Avatar */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#D6B97B',
                border: '2px solid #D6B97B',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F2E2A'
              }}
            >
              NK
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#F7F5F0' }}>
          {/* KPI Cards Row */}
          <div className="flex gap-5" style={{ padding: '32px' }}>
            {/* Card 1: Today's Orders */}
            <div
              className="flex-1"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                {/* Icon */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F3EFE6'
                  }}
                >
                  {getKPIIcon('orders')}
                </div>

                {/* Change badge */}
                <div
                  style={{
                    background: '#F0FDF4',
                    color: '#15803D',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  ↑ +12%
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0F2E2A',
                  marginTop: '12px',
                  marginBottom: '4px',
                  lineHeight: 1
                }}
              >
                47
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#4A5568',
                  marginBottom: '12px'
                }}
              >
                Today's Orders
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: '3px',
                  background: '#F3EFE6',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '78%',
                    height: '100%',
                    background: '#D6B97B',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>

            {/* Card 2: Active Agents */}
            <div
              className="flex-1"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F3EFE6'
                  }}
                >
                  {getKPIIcon('agents')}
                </div>

                <div
                  style={{
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  8/12
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0F2E2A',
                  marginTop: '12px',
                  marginBottom: '4px',
                  lineHeight: 1
                }}
              >
                8
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#4A5568',
                  marginBottom: '12px'
                }}
              >
                Active Agents Online
              </p>

              <div
                style={{
                  height: '3px',
                  background: '#F3EFE6',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '67%',
                    height: '100%',
                    background: '#D6B97B',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>

            {/* Card 3: Today's Revenue */}
            <div
              className="flex-1"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F3EFE6'
                  }}
                >
                  {getKPIIcon('revenue')}
                </div>

                <div
                  style={{
                    background: '#F0FDF4',
                    color: '#15803D',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  ↑ +8%
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#0F2E2A',
                  marginTop: '12px',
                  marginBottom: '4px',
                  lineHeight: 1
                }}
              >
                ₹14,230
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#4A5568',
                  marginBottom: '12px'
                }}
              >
                Today's Revenue
              </p>

              <div
                style={{
                  height: '3px',
                  background: '#F3EFE6',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '85%',
                    height: '100%',
                    background: '#D6B97B',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>

            {/* Card 4: Pending Assignment */}
            <div
              className="flex-1"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F3EFE6'
                  }}
                >
                  {getKPIIcon('pending')}
                </div>

                <div
                  style={{
                    background: '#FEF2F2',
                    color: '#991B1B',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  URGENT
                </div>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#991B1B',
                  marginTop: '12px',
                  marginBottom: '4px',
                  lineHeight: 1
                }}
              >
                3
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#4A5568',
                  marginBottom: '12px'
                }}
              >
                Pending Assignment
              </p>

              <div
                style={{
                  height: '3px',
                  background: '#F3EFE6',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#991B1B',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex gap-5" style={{ padding: '0 32px 32px' }}>
            {/* Left: Orders Table */}
            <div
              className="flex-1"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)',
                maxWidth: '65%'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0F2E2A'
                  }}
                >
                  Recent Orders
                </h2>
                <button
                  className="transition-opacity hover:opacity-70"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#D6B97B',
                    cursor: 'pointer'
                  }}
                >
                  View all →
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 mb-4">
                {['All', 'Placed', 'Processing', 'Delivered'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="transition-all"
                    style={{
                      background: activeFilter === filter ? '#D6B97B' : '#F3EFE6',
                      color: activeFilter === filter ? '#0F2E2A' : '#4A5568',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Order ID', 'Customer', 'Service', 'Agent', 'Status', 'Amount', 'Action'].map(
                        (header) => (
                          <th
                            key={header}
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#9CAB9A',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              textAlign: 'left',
                              padding: '12px 8px',
                              borderBottom: '1px solid #F3EFE6'
                            }}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="group transition-all relative"
                        style={{
                          background: index % 2 === 0 ? '#FFFFFF' : '#FAFAF8',
                          borderLeft: '3px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderLeftColor = '#D6B97B';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }}
                      >
                        <td
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#0F2E2A',
                            padding: '16px 8px'
                          }}
                        >
                          {order.id}
                        </td>
                        <td
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#0F2E2A',
                            padding: '16px 8px'
                          }}
                        >
                          {order.customer}
                        </td>
                        <td
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#4A5568',
                            padding: '16px 8px'
                          }}
                        >
                          {order.service}
                        </td>
                        <td
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#4A5568',
                            padding: '16px 8px'
                          }}
                        >
                          {order.agent || '—'}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span
                            style={{
                              ...getStatusBadgeStyle(order.status),
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              fontWeight: 500,
                              display: 'inline-block'
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0F2E2A',
                            padding: '16px 8px'
                          }}
                        >
                          ₹{order.amount}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          {!order.agent && (
                            <button
                              className="transition-opacity hover:opacity-70"
                              style={{
                                background: 'none',
                                border: 'none',
                                fontFamily: 'var(--font-body)',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#D6B97B',
                                cursor: 'pointer'
                              }}
                            >
                              Assign →
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex flex-col gap-5" style={{ width: '35%' }}>
              {/* Online Agents Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '12px'
                  }}
                >
                  8 agents online now
                </h3>

                {/* Avatar circles */}
                <div className="flex items-center mb-3">
                  {['RK', 'AS', 'SD', 'PM', 'VK', 'AJ', 'NK', 'RP'].map((initials, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#D6B97B',
                        border: '2px solid #FFFFFF',
                        marginLeft: i > 0 ? '-8px' : '0',
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        zIndex: 8 - i
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#4A5568'
                  }}
                >
                  5 on pickup · 3 idle
                </p>
              </div>

              {/* Revenue Sparkline Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0F2E2A',
                    marginBottom: '4px'
                  }}
                >
                  ₹14,230
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#4A5568',
                    marginBottom: '16px'
                  }}
                >
                  Today's revenue
                </p>

                {/* Mini sparkline chart */}
                <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                  {/* Fill area */}
                  <path
                    d="M 0 60 L 0 40 Q 50 35 100 30 T 200 20 L 300 15 L 300 60 Z"
                    fill="#F5EDDA"
                    opacity="0.5"
                  />
                  {/* Line */}
                  <path
                    d="M 0 40 Q 50 35 100 30 T 200 20 L 300 15"
                    fill="none"
                    stroke="#D6B97B"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Urgent Card */}
              <div
                style={{
                  background: '#0F2E2A',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#F3EFE6',
                    marginBottom: '12px'
                  }}
                >
                  3 orders pending agent
                </h3>

                <button
                  className="w-full transition-all active:scale-98"
                  style={{
                    background: '#D6B97B',
                    color: '#0F2E2A',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Assign now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}