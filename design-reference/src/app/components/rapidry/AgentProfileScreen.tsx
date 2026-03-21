import React from 'react';

interface AgentProfileScreenProps {
  agentName?: string;
  rating?: number;
  totalDeliveries?: number;
  monthlyTasks?: number;
  monthlyEarnings?: number;
  isVerified?: boolean;
  onVehicleDetails?: () => void;
  onBankAccount?: () => void;
  onNotifications?: () => void;
  onHelp?: () => void;
  onSignOut?: () => void;
}

export function AgentProfileScreen({
  agentName = 'Ravi Prasad',
  rating = 4.8,
  totalDeliveries = 127,
  monthlyTasks = 48,
  monthlyEarnings = 3840,
  isVerified = true,
  onVehicleDetails,
  onBankAccount,
  onNotifications,
  onHelp,
  onSignOut
}: AgentProfileScreenProps) {
  // Get initials from agent name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      id: 'vehicle',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 17H4C3.46957 17 2.96086 16.7893 2.58579 16.4142C2.21071 16.0391 2 15.5304 2 15V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H9L12 9H18L17 14" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="8" cy="17" r="2" stroke="#D6B97B" strokeWidth="2"/>
          <circle cx="16" cy="17" r="2" stroke="#D6B97B" strokeWidth="2"/>
        </svg>
      ),
      label: 'Vehicle Details',
      onClick: onVehicleDetails,
      hasChevron: true
    },
    {
      id: 'bank',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="4" width="22" height="16" rx="2" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M1 10H23" stroke="#D6B97B" strokeWidth="2"/>
        </svg>
      ),
      label: 'Bank Account',
      onClick: onBankAccount,
      hasChevron: true
    },
    {
      id: 'notifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Notifications',
      onClick: onNotifications,
      hasChevron: true
    },
    {
      id: 'help',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'Help & Support',
      onClick: onHelp,
      hasChevron: true
    },
    {
      id: 'version',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      label: 'App Version',
      value: '1.0.0',
      hasChevron: false
    }
  ];

  return (
    <div
      style={{
        width: '390px',
        height: '844px',
        background: '#0F2E2A',
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      {/* Status Bar Spacer */}
      <div style={{ height: '47px' }} />

      {/* Header */}
      <div style={{ padding: '0 16px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: '#F3EFE6',
            textAlign: 'center'
          }}
        >
          My Profile
        </h1>
      </div>

      {/* Profile Hero */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Avatar Circle */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#183F3A',
            border: '2px solid #D6B97B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#D6B97B'
            }}
          >
            {getInitials(agentName)}
          </span>
        </div>

        {/* Agent Name */}
        <h2
          style={{
            marginTop: '12px',
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#F3EFE6',
            textAlign: 'center'
          }}
        >
          {agentName}
        </h2>

        {/* Role Label */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9CAB9A',
            textAlign: 'center'
          }}
        >
          Delivery Agent · Rapidry
        </p>

        {/* Rating Row */}
        <div
          style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {/* Star Icons */}
          {[1, 2, 3].map((star) => (
            <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="#D6B97B" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ))}

          {/* Rating Number */}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#D6B97B',
              marginLeft: '2px'
            }}
          >
            {rating.toFixed(1)}
          </span>

          {/* Deliveries Count */}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 400,
              color: '#9CAB9A'
            }}
          >
            ({totalDeliveries} deliveries)
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          marginTop: '24px',
          padding: '0 16px',
          display: 'flex',
          gap: '10px'
        }}
      >
        {/* Stat Card 1: This Month */}
        <div
          style={{
            flex: 1,
            background: '#183F3A',
            borderRadius: '14px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#F3EFE6',
              textAlign: 'center'
            }}
          >
            {monthlyTasks}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A',
              textAlign: 'center'
            }}
          >
            This Month
          </p>
        </div>

        {/* Stat Card 2: Earnings */}
        <div
          style={{
            flex: 1,
            background: '#183F3A',
            borderRadius: '14px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#F3EFE6',
              textAlign: 'center'
            }}
          >
            ₹{monthlyEarnings.toLocaleString()}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A',
              textAlign: 'center'
            }}
          >
            Earnings
          </p>
        </div>

        {/* Stat Card 3: Rating */}
        <div
          style={{
            flex: 1,
            background: '#183F3A',
            borderRadius: '14px',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: '#F3EFE6',
              textAlign: 'center'
            }}
          >
            {rating.toFixed(1)}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: 400,
              color: '#9CAB9A',
              textAlign: 'center'
            }}
          >
            Rating
          </p>
        </div>
      </div>

      {/* KYC Status Card */}
      {isVerified && (
        <div style={{ marginTop: '16px', padding: '0 16px' }}>
          <div
            style={{
              background: '#183F3A',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {/* Green Checkmark Circle */}
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Text Content */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F3EFE6',
                  marginBottom: '2px'
                }}
              >
                Identity Verified
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#9CAB9A'
                }}
              >
                Aadhaar + Driving Licence verified
              </p>
            </div>

            {/* Verified Pill */}
            <div
              style={{
                background: 'rgba(21,128,61,0.15)',
                borderRadius: '999px',
                padding: '4px 10px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#15803D'
                }}
              >
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Menu */}
      <div style={{ marginTop: '20px', padding: '0 16px' }}>
        {/* Main Menu Card */}
        <div
          style={{
            background: '#183F3A',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          {menuItems.map((item, index) => (
            <div key={item.id}>
              {index > 0 && (
                <div
                  style={{
                    height: '0.5px',
                    background: '#0F2E2A',
                    margin: '0 18px'
                  }}
                />
              )}
              <button
                onClick={item.onClick}
                style={{
                  width: '100%',
                  height: '52px',
                  padding: '0 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: item.hasChevron ? 'pointer' : 'default',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => item.hasChevron && (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => item.hasChevron && (e.currentTarget.style.opacity = '1')}
              >
                {/* Icon */}
                {item.icon}

                {/* Label */}
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#F3EFE6'
                  }}
                >
                  {item.label}
                </span>

                {/* Version Number or Chevron */}
                {item.value ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#9CAB9A'
                    }}
                  >
                    {item.value}
                  </span>
                ) : item.hasChevron ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
            </div>
          ))}
        </div>

        {/* Sign Out Button - Separate */}
        <div style={{ marginTop: '8px' }}>
          <button
            onClick={onSignOut}
            style={{
              width: '100%',
              height: '52px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#183F3A',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {/* Exit Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7M21 12H9" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Label */}
            <span
              style={{
                flex: 1,
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                fontWeight: 600,
                color: '#991B1B'
              }}
            >
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Spacing for Nav */}
      <div style={{ height: '100px' }} />

      {/* Agent Bottom Navigation Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '390px',
          height: '72px',
          background: '#0F2E2A',
          borderTop: '1px solid rgba(214,185,123,0.15)',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {/* Tasks Tab */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="2" width="8" height="4" rx="1" stroke="#9CAB9A" strokeWidth="2"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>Tasks</span>
        </button>

        {/* Map Tab */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#9CAB9A" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="#9CAB9A" strokeWidth="2"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>Map</span>
        </button>

        {/* Earnings Tab */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#9CAB9A" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>Earnings</span>
        </button>

        {/* Profile Tab - ACTIVE */}
        <button
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          {/* Active Gold Indicator */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              width: '20px',
              height: '3px',
              borderRadius: '999px',
              background: '#D6B97B'
            }}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#D6B97B" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#D6B97B"/>
            <circle cx="12" cy="9" r="3" fill="#0F2E2A"/>
            <path d="M6.5 18.5C7.5 16.5 9.5 15 12 15C14.5 15 16.5 16.5 17.5 18.5" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#D6B97B' }}>Profile</span>
        </button>
      </div>
    </div>
  );
}
