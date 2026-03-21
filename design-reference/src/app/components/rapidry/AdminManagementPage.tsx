import React, { useState } from 'react';

// For React Native export: Save this as logo-light.png
import logoLight from 'figma:asset/35f760095b7ec0e7f2f8193910c32d87fbed5934.png';

type TabType = 'Agents' | 'Partners' | 'Customers' | 'Coupons' | 'Service Catalog';

interface Agent {
  id: string;
  name: string;
  phone: string;
  photo: string;
  status: 'Online' | 'Offline';
  todayTasks: number;
  rating: number;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
}

interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Flat';
  value: number;
  minOrder: number;
  uses: number;
  maxUses: number;
  expiry: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

interface Service {
  id: string;
  name: string;
  icon: string;
  price: number;
  unit: string;
  isActive: boolean;
}

export function AdminManagementPage() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('Agents');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  // Mock data
  const agents: Agent[] = [
    { id: '1', name: 'Ravi Kumar', phone: '+91 98765 43210', photo: 'RK', status: 'Online', todayTasks: 8, rating: 4.8, kycStatus: 'Verified' },
    { id: '2', name: 'Amit Singh', phone: '+91 98123 45678', photo: 'AS', status: 'Online', todayTasks: 6, rating: 4.6, kycStatus: 'Verified' },
    { id: '3', name: 'Suresh Das', phone: '+91 99887 76655', photo: 'SD', status: 'Online', todayTasks: 5, rating: 4.9, kycStatus: 'Verified' },
    { id: '4', name: 'Vikram Patel', phone: '+91 91234 56789', photo: 'VP', status: 'Offline', todayTasks: 0, rating: 4.5, kycStatus: 'Verified' },
    { id: '5', name: 'Rajesh Mehta', phone: '+91 98888 77777', photo: 'RM', status: 'Online', todayTasks: 7, rating: 4.7, kycStatus: 'Pending' },
    { id: '6', name: 'Anil Sharma', phone: '+91 97777 66666', photo: 'AS', status: 'Offline', todayTasks: 0, rating: 4.4, kycStatus: 'Rejected' }
  ];

  const coupons: Coupon[] = [
    { id: '1', code: 'WELCOME50', type: 'Percentage', value: 50, minOrder: 500, uses: 247, maxUses: 1000, expiry: 'Mar 31, 2026', status: 'Active' },
    { id: '2', code: 'FLAT200', type: 'Flat', value: 200, minOrder: 800, uses: 89, maxUses: 500, expiry: 'Apr 15, 2026', status: 'Active' },
    { id: '3', code: 'PREMIUM25', type: 'Percentage', value: 25, minOrder: 1000, uses: 134, maxUses: 300, expiry: 'May 01, 2026', status: 'Active' },
    { id: '4', code: 'FIRST100', type: 'Flat', value: 100, minOrder: 300, uses: 500, maxUses: 500, expiry: 'Feb 28, 2026', status: 'Expired' }
  ];

  const services: Service[] = [
    { id: '1', name: 'Wash & Iron', icon: 'wash', price: 80, unit: 'per piece', isActive: true },
    { id: '2', name: 'Dry Cleaning', icon: 'dry', price: 150, unit: 'per piece', isActive: true },
    { id: '3', name: 'Premium Care', icon: 'premium', price: 250, unit: 'per piece', isActive: true },
    { id: '4', name: 'Express Wash', icon: 'express', price: 120, unit: 'per piece', isActive: true },
    { id: '5', name: 'Wash & Fold', icon: 'fold', price: 60, unit: 'per kg', isActive: true },
    { id: '6', name: 'Steam Iron', icon: 'iron', price: 40, unit: 'per piece', isActive: false }
  ];

  const onlineAgents = agents.filter(a => a.status === 'Online').length;
  const offlineAgents = agents.filter(a => a.status === 'Offline').length;
  const pendingApproval = agents.filter(a => a.kycStatus === 'Pending').length;

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

  const getNavIcon = (iconName: string, isActive: boolean) => {
    const color = isActive ? '#D6B97B' : '#9CAB9A';

    switch (iconName) {
      case 'dashboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'orders':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2" />
            <path d="M9 12H15M9 16H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'agents':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'partners':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'customers':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'analytics':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path d="M7 14L12 9L16 13L21 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12V8H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'coupons':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6.5" cy="6.5" r="1.5" fill={color} />
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
            <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getServiceIcon = (iconType: string) => {
    const color = '#0F2E2A';
    switch (iconType) {
      case 'wash':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="28" r="12" stroke={color} strokeWidth="2.5" />
            <path d="M16 28C16 24 20 20 24 20C28 20 32 24 32 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="8" y="8" width="32" height="8" rx="2" stroke={color} strokeWidth="2.5" />
            <circle cx="14" cy="12" r="1.5" fill={color} />
            <circle cx="20" cy="12" r="1.5" fill={color} />
          </svg>
        );
      case 'dry':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 10L28 14L24 18L20 14L24 10Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 18V38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 30C16 30 18 28 24 28C30 28 32 30 32 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="38" r="2" fill={color} />
          </svg>
        );
      case 'premium':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 8L28 20H40L30 28L34 40L24 32L14 40L18 28L8 20H20L24 8Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'express':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 10L12 24H24L20 38L36 24H24L28 10Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'fold':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="28" height="28" rx="2" stroke={color} strokeWidth="2.5" />
            <path d="M10 24H38M24 10V38" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'iron':
        return (
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M36 18H12C10.8954 18 10 18.8954 10 20V28C10 29.1046 10.8954 30 12 30H36C37.1046 30 38 29.1046 38 28V20C38 18.8954 37.1046 18 36 18Z" stroke={color} strokeWidth="2.5" />
            <path d="M34 18V14C34 12.8954 33.1046 12 32 12H28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="20" cy="24" r="1.5" fill={color} />
            <circle cx="28" cy="24" r="1.5" fill={color} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[900px] w-[1440px] bg-[#F7F5F0]">
      {/* Left Sidebar */}
      <aside className="w-[240px] h-full flex flex-col" style={{ background: '#0F2E2A' }}>
        <div style={{ padding: '24px' }}>
          <img src={logoLight} alt="Rapidry" style={{ height: '24px', marginBottom: '4px' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {['MAIN', 'MANAGE', 'SYSTEM'].map((section) => (
            <div key={section}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 500, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '1px', padding: '24px 20px 8px' }}>
                {section}
              </div>
              {navItems.filter((item) => item.section === section).map((item) => {
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
                      if (!isActive) e.currentTarget.style.background = 'rgba(243,239,230,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full" style={{ background: '#D6B97B' }} />}
                    <span>{getNavIcon(item.icon, isActive)}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: isActive ? 600 : 400, color: '#F3EFE6', opacity: isActive ? 1 : 0.7 }}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t" style={{ padding: '20px 16px', borderTopColor: 'rgba(243,239,230,0.10)' }}>
          <div className="flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#D6B97B', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
            NK
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#F3EFE6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nayan Kumar
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>Super Admin</p>
          </div>
          <button className="transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17L21 12L16 7" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b" style={{ height: '64px', padding: '0 32px', background: '#FFFFFF', borderBottomColor: '#EAE4D8' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: '#0F2E2A', marginBottom: '2px' }}>
              Management
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
              Manage agents, coupons, and services
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute -top-1 -right-1" style={{ background: '#991B1B', color: '#FFFFFF', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '999px', fontFamily: 'var(--font-body)' }}>
                3
              </span>
            </button>
            <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D6B97B', border: '2px solid #D6B97B', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
              NK
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div style={{ margin: '24px 32px 0' }}>
          <div style={{ display: 'inline-flex', background: '#F3EFE6', borderRadius: '16px', padding: '4px', gap: '4px' }}>
            {(['Agents', 'Partners', 'Customers', 'Coupons', 'Service Catalog'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="transition-all"
                style={{
                  background: activeTab === tab ? '#0F2E2A' : 'transparent',
                  color: activeTab === tab ? '#FFFFFF' : '#4A5568',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 600 : 400,
                  padding: '8px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#F7F5F0' }}>
          {activeTab === 'Agents' && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between" style={{ margin: '20px 32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
                  {agents.length} Agents
                </h2>
                <button
                  className="transition-all hover:opacity-90"
                  style={{
                    background: '#D6B97B',
                    color: '#0F2E2A',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  + Add Agent
                </button>
              </div>

              {/* Stats Strip */}
              <div className="flex gap-3" style={{ margin: '0 32px 20px' }}>
                <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #EAE4D8' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Online
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#15803D' }}>{onlineAgents}</div>
                </div>
                <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #EAE4D8' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Offline
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#4A5568' }}>{offlineAgents}</div>
                </div>
                <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #D6B97B' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Pending Approval
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: '#D6B97B' }}>{pendingApproval}</div>
                </div>
              </div>

              {/* Agents Table */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', margin: '0 32px 32px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Photo</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Phone</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Today's Tasks</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Rating</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>KYC Status</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} style={{ borderBottom: '0.5px solid #F3EFE6' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div className="flex items-center justify-center" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D6B97B', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
                            {agent.photo}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>{agent.name}</td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>{agent.phone}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              background: agent.status === 'Online' ? '#F0FDF4' : '#F3F4F6',
                              color: agent.status === 'Online' ? '#15803D' : '#6B7280',
                              border: `1px solid ${agent.status === 'Online' ? '#86EFAC' : '#D1D5DB'}`,
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              fontWeight: 500,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.status === 'Online' ? '#15803D' : '#6B7280' }} />
                            {agent.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>{agent.todayTasks}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#D6B97B" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>{agent.rating}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              background: agent.kycStatus === 'Verified' ? '#F0FDF4' : agent.kycStatus === 'Pending' ? 'rgba(214,185,123,0.12)' : '#FEF2F2',
                              color: agent.kycStatus === 'Verified' ? '#15803D' : agent.kycStatus === 'Pending' ? '#D6B97B' : '#991B1B',
                              border: `1px solid ${agent.kycStatus === 'Verified' ? '#86EFAC' : agent.kycStatus === 'Pending' ? '#D6B97B' : '#FCA5A5'}`,
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              fontWeight: 500,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {agent.kycStatus === 'Verified' && '✓ '}
                            {agent.kycStatus}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div className="flex items-center gap-2">
                            <button className="transition-all hover:bg-[#F3EFE6]" style={{ background: 'none', border: '1px solid #EAE4D8', borderRadius: '6px', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#0F2E2A', cursor: 'pointer' }}>
                              View
                            </button>
                            <button className="transition-all hover:bg-[#FEF2F2]" style={{ background: 'none', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#991B1B', cursor: 'pointer' }}>
                              Suspend
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Coupons' && (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between" style={{ margin: '20px 32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
                  Active Coupons: {coupons.filter((c) => c.status === 'Active').length}
                </h2>
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="transition-all hover:opacity-90"
                  style={{
                    background: '#D6B97B',
                    color: '#0F2E2A',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  + Create Coupon
                </button>
              </div>

              {/* Coupons Table */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', margin: '0 32px 32px', boxShadow: '0px 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Code</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Value</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Min Order</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Uses</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Expiry</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} style={{ borderBottom: '0.5px solid #F3EFE6' }}>
                        <td style={{ padding: '16px 20px', fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 700, color: '#0F2E2A' }}>
                          {coupon.code}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: '#F3EFE6', color: '#0F2E2A', borderRadius: '999px', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500 }}>
                            {coupon.type}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#D6B97B' }}>
                          {coupon.type === 'Percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                          ₹{coupon.minOrder}
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                          {coupon.uses} / {coupon.maxUses}
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                          {coupon.expiry}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              background: coupon.status === 'Active' ? '#F0FDF4' : coupon.status === 'Expired' ? '#FEF2F2' : '#F3F4F6',
                              color: coupon.status === 'Active' ? '#15803D' : coupon.status === 'Expired' ? '#991B1B' : '#6B7280',
                              border: `1px solid ${coupon.status === 'Active' ? '#86EFAC' : coupon.status === 'Expired' ? '#FCA5A5' : '#D1D5DB'}`,
                              borderRadius: '999px',
                              padding: '4px 10px',
                              fontFamily: 'var(--font-body)',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                          >
                            {coupon.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div className="flex items-center gap-2">
                            <button className="transition-all hover:bg-[#F3EFE6]" style={{ background: 'none', border: '1px solid #EAE4D8', borderRadius: '6px', padding: '4px 10px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: '#0F2E2A', cursor: 'pointer' }}>
                              Edit
                            </button>
                            <button className="transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="5" r="1.5" fill="#9CAB9A" />
                                <circle cx="12" cy="12" r="1.5" fill="#9CAB9A" />
                                <circle cx="12" cy="19" r="1.5" fill="#9CAB9A" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Service Catalog' && (
            <div>
              {/* Header */}
              <div style={{ margin: '20px 32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
                  Service Catalog
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#9CAB9A', marginTop: '4px' }}>
                  Manage pricing and availability
                </p>
              </div>

              {/* Service Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  margin: '0 32px 32px'
                }}
              >
                {services.map((service) => {
                  const isEditing = editingServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      className="group relative"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                        border: '1.5px solid #EAE4D8',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D6B97B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#EAE4D8';
                      }}
                    >
                      {/* Service Icon & Name */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div style={{ marginBottom: '12px' }}>{getServiceIcon(service.icon)}</div>
                          <h3
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '16px',
                              fontWeight: 600,
                              color: '#0F2E2A',
                              marginBottom: '4px'
                            }}
                          >
                            {service.name}
                          </h3>
                        </div>

                        {/* Active Toggle */}
                        <button
                          style={{
                            width: '44px',
                            height: '24px',
                            borderRadius: '999px',
                            background: service.isActive ? '#15803D' : '#D1D5DB',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#FFFFFF',
                              position: 'absolute',
                              top: '3px',
                              left: service.isActive ? '23px' : '3px',
                              transition: 'all 0.2s'
                            }}
                          />
                        </button>
                      </div>

                      {/* Price Display/Edit */}
                      {isEditing ? (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#D6B97B'
                              }}
                            >
                              ₹
                            </span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              autoFocus
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#D6B97B',
                                border: '2px solid #D6B97B',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                width: '100px',
                                background: '#FFFBF5'
                              }}
                            />
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              fontWeight: 400,
                              color: '#9CAB9A',
                              marginBottom: '12px'
                            }}
                          >
                            {service.unit}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingServiceId(null);
                                setEditPrice('');
                              }}
                              className="flex-1 transition-all hover:opacity-90"
                              style={{
                                background: '#D6B97B',
                                color: '#0F2E2A',
                                fontFamily: 'var(--font-body)',
                                fontSize: '13px',
                                fontWeight: 600,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#0F2E2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingServiceId(null);
                                setEditPrice('');
                              }}
                              className="transition-all hover:bg-[#F3EFE6]"
                              style={{
                                background: 'transparent',
                                color: '#991B1B',
                                fontFamily: 'var(--font-body)',
                                fontSize: '13px',
                                fontWeight: 600,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #FCA5A5',
                                cursor: 'pointer'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#D6B97B'
                              }}
                            >
                              ₹{service.price}
                            </span>
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              fontWeight: 400,
                              color: '#9CAB9A',
                              marginBottom: '12px'
                            }}
                          >
                            {service.unit}
                          </p>

                          {/* Edit Button (shows on hover) */}
                          <button
                            onClick={() => {
                              setEditingServiceId(service.id);
                              setEditPrice(service.price.toString());
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-all hover:bg-[rgba(214,185,123,0.1)]"
                            style={{
                              background: 'transparent',
                              color: '#D6B97B',
                              fontFamily: 'var(--font-body)',
                              fontSize: '13px',
                              fontWeight: 600,
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #D6B97B',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                stroke="#D6B97B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                                stroke="#D6B97B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Edit Pricing
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'Partners' && (
            <div style={{ padding: '60px 32px', textAlign: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 20px' }}>
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#9CAB9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="#9CAB9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#0F2E2A', marginBottom: '8px' }}>
                Partners Management
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, color: '#9CAB9A' }}>
                Coming soon...
              </p>
            </div>
          )}

          {activeTab === 'Customers' && (
            <div style={{ padding: '60px 32px', textAlign: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 20px' }}>
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#9CAB9A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#9CAB9A" strokeWidth="1.5" />
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#0F2E2A', marginBottom: '8px' }}>
                Customers Management
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, color: '#9CAB9A' }}>
                Coming soon...
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center"
            onClick={() => setShowCouponModal(false)}
          >
            {/* Modal */}
            <div
              className="bg-white z-50"
              style={{
                width: '480px',
                borderRadius: '20px',
                boxShadow: '0px 24px 64px rgba(15,46,42,0.20)',
                padding: '32px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#0F2E2A'
                  }}
                >
                  Create Coupon Code
                </h3>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="transition-opacity hover:opacity-70"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    marginTop: '-4px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F2E2A'
                      }}
                    >
                      Coupon Code
                    </label>
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
                      Generate random
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., WELCOME50"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid #EAE4D8',
                      borderRadius: '10px',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0F2E2A',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>

                {/* Type Radio Pills */}
                <div>
                  <label
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0F2E2A',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Discount Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 transition-all"
                      style={{
                        padding: '12px 16px',
                        border: '1.5px solid #D6B97B',
                        borderRadius: '10px',
                        background: '#D6B97B',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        cursor: 'pointer'
                      }}
                    >
                      Percentage %
                    </button>
                    <button
                      className="flex-1 transition-all hover:bg-[rgba(214,185,123,0.08)]"
                      style={{
                        padding: '12px 16px',
                        border: '1.5px solid #EAE4D8',
                        borderRadius: '10px',
                        background: 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#4A5568',
                        cursor: 'pointer'
                      }}
                    >
                      Flat Amount ₹
                    </button>
                  </div>
                </div>

                {/* Value & Min Order (2-col) */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Discount Value
                    </label>
                    <input
                      type="number"
                      placeholder="50"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #EAE4D8',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: '#0F2E2A'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Min Order (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="500"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #EAE4D8',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: '#0F2E2A'
                      }}
                    />
                  </div>
                </div>

                {/* Usage Limit & Expiry (2-col) */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      placeholder="1000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #EAE4D8',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: '#0F2E2A'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #EAE4D8',
                        borderRadius: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: '#0F2E2A'
                      }}
                    />
                  </div>
                </div>

                {/* Create Button */}
                <button
                  className="transition-all hover:opacity-90"
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: '#D6B97B',
                    color: '#0F2E2A',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Create Coupon
                </button>

                {/* Cancel Button */}
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="transition-all hover:bg-[#F3EFE6]"
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'transparent',
                    color: '#4A5568',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1.5px solid #EAE4D8',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
