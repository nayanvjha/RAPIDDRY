import React from 'react';

interface BottomNavBarProps {
  activeTab: 'home' | 'services' | 'orders' | 'track' | 'profile';
  onTabChange: (tab: 'home' | 'services' | 'orders' | 'track' | 'profile') => void;
}

export function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home' },
    { id: 'services' as const, label: 'Services' },
    { id: 'orders' as const, label: 'Orders' },
    { id: 'track' as const, label: 'Track' },
    { id: 'profile' as const, label: 'Profile' }
  ];

  const getIcon = (tabId: string, isActive: boolean) => {
    const iconColor = isActive ? '#0F2E2A' : '#9CAB9A';
    const size = 22;

    switch (tabId) {
      case 'home':
        return isActive ? (
          // Home Filled
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" fill={iconColor} stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" fill={iconColor} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          // Home Outlined
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );

      case 'services':
        return isActive ? (
          // Grid Filled
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="1" fill={iconColor}/>
            <rect x="3" y="13" width="8" height="8" rx="1" fill={iconColor}/>
            <rect x="13" y="3" width="8" height="8" rx="1" fill={iconColor}/>
            <rect x="13" y="13" width="8" height="8" rx="1" fill={iconColor}/>
          </svg>
        ) : (
          // Grid Outlined
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="1" stroke={iconColor} strokeWidth="2"/>
            <rect x="3" y="13" width="8" height="8" rx="1" stroke={iconColor} strokeWidth="2"/>
            <rect x="13" y="3" width="8" height="8" rx="1" stroke={iconColor} strokeWidth="2"/>
            <rect x="13" y="13" width="8" height="8" rx="1" stroke={iconColor} strokeWidth="2"/>
          </svg>
        );

      case 'orders':
        return isActive ? (
          // Clipboard Filled
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" fill={iconColor} stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="2" width="8" height="4" rx="1" fill={iconColor} stroke={iconColor} strokeWidth="2"/>
            <path d="M9 12H15M9 16H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // Clipboard Outlined
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="2" width="8" height="4" rx="1" stroke={iconColor} strokeWidth="2"/>
            <path d="M9 12H15M9 16H15" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );

      case 'track':
        return isActive ? (
          // Location Pin Filled
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" fill={iconColor} stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
          </svg>
        ) : (
          // Location Pin Outlined
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="3" stroke={iconColor} strokeWidth="2"/>
          </svg>
        );

      case 'profile':
        return isActive ? (
          // Person Circle Filled
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill={iconColor}/>
            <circle cx="12" cy="9" r="3" fill="white"/>
            <path d="M6.5 18.5C7.5 16.5 9.5 15 12 15C14.5 15 16.5 16.5 17.5 18.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // Person Circle Outlined
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2"/>
            <circle cx="12" cy="9" r="3" stroke={iconColor} strokeWidth="2"/>
            <path d="M6.5 18.5C7.5 16.5 9.5 15 12 15C14.5 15 16.5 16.5 17.5 18.5" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: '390px',
        height: '72px',
        background: '#FFFFFF',
        borderTop: '1px solid #F0EDE6',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
            {/* Active indicator */}
            {isActive && (
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
            )}
            
            {/* Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getIcon(tab.id, isActive)}
            </div>
            
            {/* Label */}
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#0F2E2A' : '#9CAB9A',
                lineHeight: 1
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
