import React, { useState, useRef } from 'react';

// For React Native export: Save this as logo-light.png
import logoLight from 'figma:asset/35f760095b7ec0e7f2f8193910c32d87fbed5934.png';
import { AgentAssignmentDropdown } from './AgentAssignmentDropdown';

interface Order {
  id: string;
  customer: {
    name: string;
    initials: string;
    phone: string;
  };
  service: string;
  pickupSlot: string;
  agent: {
    name: string;
    initials: string;
  } | null;
  partner: string;
  status: 'Placed' | 'Processing' | 'Out for Pickup' | 'At Partner' | 'Delivered' | 'Cancelled';
  amount: number;
  items: { name: string; quantity: number; price: number }[];
  address: string;
  timeline: { time: string; event: string; status: 'completed' | 'current' | 'pending' }[];
}

export function AdminOrdersPage() {
  const [activeNav, setActiveNav] = useState('Orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assignDropdownOrderId, setAssignDropdownOrderId] = useState<string | null>(null);
  const [assignButtonRef, setAssignButtonRef] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock agents data
  const agents = [
    { id: '1', name: 'Ravi Kumar', initials: 'RK' },
    { id: '2', name: 'Amit Singh', initials: 'AS' },
    { id: '3', name: 'Suresh Das', initials: 'SD' },
    { id: '4', name: 'Vikram Patel', initials: 'VP' },
  ];

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'RD-2847',
      customer: { name: 'Nishant Sarawgi', initials: 'NS', phone: '+91 98765 43210' },
      service: 'Wash & Iron',
      pickupSlot: 'Tue 21 · 11AM-1PM',
      agent: { name: 'Ravi Kumar', initials: 'RK' },
      partner: 'Elite Cleaners',
      status: 'Processing',
      amount: 640,
      items: [
        { name: 'Shirt (Formal)', quantity: 3, price: 180 },
        { name: 'Trousers', quantity: 2, price: 280 },
        { name: 'T-Shirt', quantity: 4, price: 180 }
      ],
      address: '204, Bandra West, Mumbai 400050',
      timeline: [
        { time: '10:30 AM', event: 'Order Placed', status: 'completed' },
        { time: '11:15 AM', event: 'Agent Assigned', status: 'completed' },
        { time: '11:45 AM', event: 'Pickup In Progress', status: 'current' },
        { time: 'Pending', event: 'At Partner Facility', status: 'pending' },
        { time: 'Pending', event: 'Delivery', status: 'pending' }
      ]
    },
    {
      id: 'RD-2846',
      customer: { name: 'Priya Sharma', initials: 'PS', phone: '+91 98123 45678' },
      service: 'Dry Cleaning',
      pickupSlot: 'Tue 21 · 2PM-4PM',
      agent: { name: 'Amit Singh', initials: 'AS' },
      partner: 'Premium Care',
      status: 'At Partner',
      amount: 1240,
      items: [
        { name: 'Blazer', quantity: 1, price: 400 },
        { name: 'Dress (Silk)', quantity: 2, price: 840 }
      ],
      address: '12A, Juhu, Mumbai 400049',
      timeline: [
        { time: '09:00 AM', event: 'Order Placed', status: 'completed' },
        { time: '09:30 AM', event: 'Agent Assigned', status: 'completed' },
        { time: '02:15 PM', event: 'Picked Up', status: 'completed' },
        { time: '03:00 PM', event: 'At Partner Facility', status: 'current' },
        { time: 'Pending', event: 'Delivery', status: 'pending' }
      ]
    },
    {
      id: 'RD-2845',
      customer: { name: 'Rahul Verma', initials: 'RV', phone: '+91 99887 76655' },
      service: 'Wash & Fold',
      pickupSlot: 'Wed 22 · 10AM-12PM',
      agent: null,
      partner: 'Quick Wash Co',
      status: 'Placed',
      amount: 480,
      items: [
        { name: 'Casual Shirt', quantity: 6, price: 480 }
      ],
      address: '78, Andheri East, Mumbai 400069',
      timeline: [
        { time: '08:45 AM', event: 'Order Placed', status: 'current' },
        { time: 'Pending', event: 'Agent Assignment', status: 'pending' },
        { time: 'Pending', event: 'Pickup', status: 'pending' },
        { time: 'Pending', event: 'At Partner Facility', status: 'pending' },
        { time: 'Pending', event: 'Delivery', status: 'pending' }
      ]
    },
    {
      id: 'RD-2844',
      customer: { name: 'Anjali Gupta', initials: 'AG', phone: '+91 98765 12345' },
      service: 'Premium Care',
      pickupSlot: 'Mon 20 · 5PM-7PM',
      agent: { name: 'Ravi Kumar', initials: 'RK' },
      partner: 'Luxury Fabrics',
      status: 'Delivered',
      amount: 2180,
      items: [
        { name: 'Designer Saree', quantity: 1, price: 800 },
        { name: 'Lehenga', quantity: 1, price: 1200 },
        { name: 'Blouse', quantity: 2, price: 180 }
      ],
      address: '45, Worli, Mumbai 400018',
      timeline: [
        { time: 'Mar 19, 4PM', event: 'Order Placed', status: 'completed' },
        { time: 'Mar 19, 4:30PM', event: 'Agent Assigned', status: 'completed' },
        { time: 'Mar 20, 5:30PM', event: 'Picked Up', status: 'completed' },
        { time: 'Mar 20, 7PM', event: 'At Partner', status: 'completed' },
        { time: 'Mar 21, 6PM', event: 'Delivered', status: 'completed' }
      ]
    },
    {
      id: 'RD-2843',
      customer: { name: 'Vikram Mehta', initials: 'VM', phone: '+91 91234 56789' },
      service: 'Express Wash',
      pickupSlot: 'Tue 21 · 3PM-5PM',
      agent: null,
      partner: 'Speedy Clean',
      status: 'Placed',
      amount: 820,
      items: [
        { name: 'Jeans', quantity: 4, price: 640 },
        { name: 'Jacket', quantity: 1, price: 180 }
      ],
      address: '901, Powai, Mumbai 400076',
      timeline: [
        { time: '01:15 PM', event: 'Order Placed', status: 'current' },
        { time: 'Pending', event: 'Agent Assignment', status: 'pending' },
        { time: 'Pending', event: 'Pickup', status: 'pending' },
        { time: 'Pending', event: 'Processing', status: 'pending' },
        { time: 'Pending', event: 'Delivery', status: 'pending' }
      ]
    },
    {
      id: 'RD-2842',
      customer: { name: 'Sneha Patel', initials: 'SP', phone: '+91 98888 77777' },
      service: 'Dry Cleaning',
      pickupSlot: 'Tue 21 · 9AM-11AM',
      agent: { name: 'Suresh Das', initials: 'SD' },
      partner: 'Elite Cleaners',
      status: 'Out for Pickup',
      amount: 1560,
      items: [
        { name: 'Suit (3-piece)', quantity: 1, price: 900 },
        { name: 'Coat', quantity: 1, price: 500 },
        { name: 'Scarf (Wool)', quantity: 2, price: 160 }
      ],
      address: '23B, Colaba, Mumbai 400005',
      timeline: [
        { time: '08:00 AM', event: 'Order Placed', status: 'completed' },
        { time: '08:20 AM', event: 'Agent Assigned', status: 'completed' },
        { time: '09:30 AM', event: 'Agent En Route', status: 'current' },
        { time: 'Pending', event: 'Pickup', status: 'pending' },
        { time: 'Pending', event: 'Processing', status: 'pending' }
      ]
    }
  ]);

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
      case 'Out for Pickup':
        return {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FCD34D'
        };
      case 'At Partner':
        return {
          background: '#F3E8FF',
          color: '#6B21A8',
          border: '1px solid #C084FC'
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
            <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'orders':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2" />
            <path d="M9 12H15M9 16H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'agents':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
            <path
              d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'partners':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'customers':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
          </svg>
        );
      case 'analytics':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <path
              d="M7 14L12 9L16 13L21 8"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M21 12V8H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'coupons':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6.5" cy="6.5" r="1.5" fill={color} />
          </svg>
        );
      case 'settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
            <path
              d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex h-[900px] w-[1440px] bg-[#F7F5F0]">
      {/* Left Sidebar - Same as Dashboard */}
      <aside className="w-[240px] h-full flex flex-col" style={{ background: '#0F2E2A' }}>
        {/* Brand */}
        <div style={{ padding: '24px' }}>
          <img src={logoLight} alt="Rapidry" style={{ height: '24px', marginBottom: '4px' }} />
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
                      {isActive && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                          style={{ background: '#D6B97B' }}
                        />
                      )}

                      <span>{getNavIcon(item.icon, isActive)}</span>

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
        <div className="flex items-center gap-3 border-t" style={{ padding: '20px 16px', borderTopColor: 'rgba(243,239,230,0.10)' }}>
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
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: '#9CAB9A' }}>
              Super Admin
            </p>
          </div>

          <button className="transition-opacity hover:opacity-70" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="#9CAB9A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M16 17L21 12L16 7" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              Orders
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
              Manage all customer orders
            </p>
          </div>

          <div className="flex items-center gap-4">
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

            <button
              className="relative transition-opacity hover:opacity-70"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="#0F2E2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="#0F2E2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
          {/* Filter Bar */}
          <div style={{ padding: '24px 32px 0' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative" style={{ width: '280px' }}>
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
                    placeholder="Search by order ID, customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full transition-all focus:outline-none"
                    style={{
                      height: '40px',
                      paddingLeft: '38px',
                      paddingRight: '12px',
                      border: '1.5px solid #EAE4D8',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: '#0F2E2A'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#D6B97B';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(214,185,123,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#EAE4D8';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: '140px',
                    height: '40px',
                    padding: '0 12px',
                    border: '1.5px solid #EAE4D8',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#0F2E2A',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option>All Status</option>
                  <option>Placed</option>
                  <option>Processing</option>
                  <option>Out for Pickup</option>
                  <option>At Partner</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

                {/* Date Range Dropdown */}
                <button
                  style={{
                    width: '140px',
                    height: '40px',
                    padding: '0 12px',
                    border: '1.5px solid #EAE4D8',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#0F2E2A',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9CAB9A" strokeWidth="2" />
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Last 7 days</span>
                </button>

                {/* Zone Dropdown */}
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  style={{
                    width: '140px',
                    height: '40px',
                    padding: '0 12px',
                    border: '1.5px solid #EAE4D8',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: '#0F2E2A',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option>All Zones</option>
                  <option>South Mumbai</option>
                  <option>Western Suburbs</option>
                  <option>Central Mumbai</option>
                  <option>Eastern Suburbs</option>
                </select>

                <div className="flex-1" />

                {/* Export CSV Button */}
                <button
                  className="transition-all hover:bg-[rgba(214,185,123,0.08)]"
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    border: '1.5px solid #D6B97B',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: '#D6B97B',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export CSV
                </button>

                {/* New Order Button */}
                <button
                  className="transition-all hover:opacity-90"
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#0F2E2A',
                    color: '#F3EFE6',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + New Order
                </button>
              </div>
            </div>

            {/* Active Filters Strip */}
            {(statusFilter !== 'All Status' || dateFilter !== 'Last 7 days') && (
              <div className="flex items-center gap-2" style={{ padding: '8px 0' }}>
                {statusFilter !== 'All Status' && (
                  <div
                    className="flex items-center gap-2"
                    style={{
                      background: '#D6B97B',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#0F2E2A'
                    }}
                  >
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter('All Status')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#0F2E2A'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {dateFilter !== 'Last 7 days' && (
                  <div
                    className="flex items-center gap-2"
                    style={{
                      background: '#D6B97B',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#0F2E2A'
                    }}
                  >
                    Date: {dateFilter}
                    <button
                      onClick={() => setDateFilter('Last 7 days')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#0F2E2A'
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setStatusFilter('All Status');
                    setDateFilter('Last 7 days');
                  }}
                  className="transition-opacity hover:opacity-70"
                  style={{
                    background: 'none',
                    border: '1.5px solid #D6B97B',
                    borderRadius: '999px',
                    padding: '6px 12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#D6B97B',
                    cursor: 'pointer'
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              margin: '16px 32px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
                    <th
                      style={{
                        width: '40px',
                        padding: '0 20px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      #
                    </th>
                    <th
                      onClick={() => handleSort('orderId')}
                      style={{
                        width: '100px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div className="flex items-center gap-1">
                        Order ID
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#9CAB9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </th>
                    <th
                      style={{
                        width: '160px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        width: '120px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Service
                    </th>
                    <th
                      style={{
                        width: '140px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Pickup Slot
                    </th>
                    <th
                      style={{
                        width: '140px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Agent
                    </th>
                    <th
                      style={{
                        width: '120px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Partner
                    </th>
                    <th
                      style={{
                        width: '120px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        width: '80px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        width: '100px',
                        padding: '0 12px',
                        height: '44px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="group transition-all"
                      style={{
                        borderBottom: '0.5px solid #F3EFE6',
                        height: '60px',
                        borderLeft: order.agent ? '3px solid transparent' : '3px solid #D6B97B'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = order.agent ? '#FAFAF8' : '#FFFBF0';
                        if (order.agent) {
                          e.currentTarget.style.borderLeftColor = '#D6B97B';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeftColor = order.agent ? 'transparent' : '#D6B97B';
                      }}
                    >
                      <td
                        style={{
                          padding: '0 20px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#9CAB9A'
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: '0 12px',
                          fontFamily: 'Courier New, monospace',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0F2E2A'
                        }}
                      >
                        {order.id}
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#D6B97B',
                              fontFamily: 'var(--font-body)',
                              fontSize: '10px',
                              fontWeight: 600,
                              color: '#0F2E2A'
                            }}
                          >
                            {order.customer.initials}
                          </div>
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#0F2E2A'
                            }}
                          >
                            {order.customer.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        <div
                          style={{
                            background: '#F3EFE6',
                            color: '#0F2E2A',
                            borderRadius: '999px',
                            padding: '4px 10px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {order.service}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '0 12px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#0F2E2A'
                        }}
                      >
                        {order.pickupSlot}
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        {order.agent ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#0F2E2A',
                                fontFamily: 'var(--font-body)',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#F3EFE6'
                              }}
                            >
                              {order.agent.initials}
                            </div>
                            <span
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#0F2E2A'
                              }}
                            >
                              {order.agent.name}
                            </span>
                          </div>
                        ) : (
                          <button
                            ref={(el) => {
                              if (assignDropdownOrderId === order.id) {
                                setAssignButtonRef(el);
                              }
                            }}
                            onClick={(e) => {
                              setAssignDropdownOrderId(order.id);
                              setAssignButtonRef(e.currentTarget);
                            }}
                            className="transition-opacity hover:opacity-70"
                            style={{
                              background: 'none',
                              border: 'none',
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#D6B97B',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            Assign
                          </button>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '0 12px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#4A5568'
                        }}
                      >
                        {order.partner}
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        <span
                          style={{
                            ...getStatusBadgeStyle(order.status),
                            borderRadius: '999px',
                            padding: '4px 10px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '11px',
                            fontWeight: 500,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '0 12px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0F2E2A'
                        }}
                      >
                        ₹{order.amount}
                      </td>
                      <td style={{ padding: '0 12px' }}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="transition-all hover:bg-[#F3EFE6]"
                            style={{
                              background: 'none',
                              border: '1px solid #EAE4D8',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontFamily: 'var(--font-body)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#0F2E2A',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                          <button
                            className="transition-opacity hover:opacity-70"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
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
        </div>
      </main>

      {/* Selected Order Side Panel */}
      {selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setSelectedOrder(null)}
            style={{ left: '240px' }}
          />

          {/* Side Panel */}
          <div
            className="fixed top-0 right-0 bottom-0 bg-white z-50 transition-transform"
            style={{
              width: '400px',
              borderLeft: '1px solid #EAE4D8',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 bg-white border-b flex items-center justify-between"
              style={{
                padding: '20px 24px',
                borderBottomColor: '#EAE4D8'
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#0F2E2A',
                    marginBottom: '2px'
                  }}
                >
                  Order Details
                </h3>
                <p
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#9CAB9A'
                  }}
                >
                  {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="transition-opacity hover:opacity-70"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Status Badge */}
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    ...getStatusBadgeStyle(selectedOrder.status),
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'inline-block'
                  }}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CAB9A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Customer
                </h4>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#D6B97B',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0F2E2A'
                    }}
                  >
                    {selectedOrder.customer.initials}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        marginBottom: '2px'
                      }}
                    >
                      {selectedOrder.customer.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#9CAB9A'
                      }}
                    >
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#4A5568',
                    lineHeight: 1.5
                  }}
                >
                  {selectedOrder.address}
                </p>
              </div>

              {/* Service & Pickup */}
              <div
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#F7F5F0',
                  borderRadius: '12px'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px'
                      }}
                    >
                      Service
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0F2E2A'
                      }}
                    >
                      {selectedOrder.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#9CAB9A',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px'
                      }}
                    >
                      Pickup Slot
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0F2E2A'
                      }}
                    >
                      {selectedOrder.pickupSlot}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3" style={{ borderTopColor: '#EAE4D8' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9CAB9A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px'
                    }}
                  >
                    Partner
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0F2E2A'
                    }}
                  >
                    {selectedOrder.partner}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CAB9A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                      style={{
                        padding: '10px 12px',
                        background: '#FAFAF8',
                        borderRadius: '8px'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#0F2E2A'
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#9CAB9A'
                          }}
                        >
                          × {item.quantity}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0F2E2A'
                        }}
                      >
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  className="flex justify-between items-center border-t mt-3 pt-3"
                  style={{ borderTopColor: '#EAE4D8' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0F2E2A'
                    }}
                  >
                    Total Amount
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0F2E2A'
                    }}
                  >
                    ₹{selectedOrder.amount}
                  </span>
                </div>
              </div>

              {/* Agent Info */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CAB9A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Assigned Agent
                </h4>
                {selectedOrder.agent ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#0F2E2A',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#F3EFE6'
                      }}
                    >
                      {selectedOrder.agent.initials}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0F2E2A'
                        }}
                      >
                        {selectedOrder.agent.name}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#9CAB9A'
                        }}
                      >
                        Pickup Agent
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full transition-all hover:bg-[rgba(214,185,123,0.2)]"
                    style={{
                      padding: '10px 16px',
                      border: '1.5px solid #D6B97B',
                      borderRadius: '10px',
                      background: 'rgba(214,185,123,0.12)',
                      color: '#D6B97B',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Assign Agent
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9CAB9A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px'
                  }}
                >
                  Order Timeline
                </h4>
                <div className="relative">
                  {selectedOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 relative" style={{ marginBottom: idx < selectedOrder.timeline.length - 1 ? '16px' : '0' }}>
                      {/* Dot */}
                      <div
                        className="flex items-center justify-center flex-shrink-0 relative z-10"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: event.status === 'completed' ? '#15803D' : event.status === 'current' ? '#D6B97B' : '#F3EFE6',
                          border: `2px solid ${event.status === 'completed' ? '#86EFAC' : event.status === 'current' ? '#D6B97B' : '#EAE4D8'}`
                        }}
                      >
                        {event.status === 'completed' && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {event.status === 'current' && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F2E2A' }} />
                        )}
                      </div>

                      {/* Connecting line */}
                      {idx < selectedOrder.timeline.length - 1 && (
                        <div
                          className="absolute left-[11px] top-[24px]"
                          style={{
                            width: '2px',
                            height: '16px',
                            background: event.status === 'completed' ? '#86EFAC' : '#EAE4D8'
                          }}
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 pb-1">
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '14px',
                            fontWeight: event.status === 'current' ? 600 : 500,
                            color: event.status === 'pending' ? '#9CAB9A' : '#0F2E2A',
                            marginBottom: '2px'
                          }}
                        >
                          {event.event}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            fontWeight: 400,
                            color: '#9CAB9A'
                          }}
                        >
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 transition-all hover:opacity-90"
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#0F2E2A',
                    color: '#F3EFE6',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Update Status
                </button>
                <button
                  className="transition-all hover:bg-[#F3EFE6]"
                  style={{
                    padding: '12px 16px',
                    border: '1.5px solid #EAE4D8',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: '#0F2E2A',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agent Assignment Dropdown */}
      {assignDropdownOrderId && assignButtonRef && (
        <AgentAssignmentDropdown
          anchorEl={assignButtonRef}
          onAssign={(agentId) => {
            setOrders(prevOrders => 
              prevOrders.map(order => {
                if (order.id === assignDropdownOrderId) {
                  const agent = agents.find(a => a.id === agentId);
                  return {
                    ...order,
                    agent: agent ? {
                      name: agent.name,
                      initials: agent.initials
                    } : order.agent,
                    status: 'Out for Pickup' as const
                  };
                }
                return order;
              })
            );
            setAssignDropdownOrderId(null);
            setAssignButtonRef(null);
          }}
          onClose={() => {
            setAssignDropdownOrderId(null);
            setAssignButtonRef(null);
          }}
        />
      )}
    </div>
  );
}
