import React, { useState } from 'react';
import { EmptyState } from './EmptyState';

interface Order {
  id: string;
  service: string;
  status: 'delivered' | 'processing' | 'pending';
  items: number;
  price: number;
  date: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
  destructive?: boolean;
}

interface AccountScreenProps {
  onBack?: () => void;
}

export function AccountScreen({ onBack }: AccountScreenProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const orders: Order[] = [];
  // Demo data - can be empty to show EmptyState
  // Uncomment to see orders:
  /*
  const orders: Order[] = [
    {
      id: 'RD-240003',
      service: 'Wash & Iron',
      status: 'delivered',
      items: 3,
      price: 289,
      date: '21 March 2026'
    },
    {
      id: 'RD-240002',
      service: 'Dry Cleaning',
      status: 'processing',
      items: 5,
      price: 450,
      date: '20 March 2026'
    },
    {
      id: 'RD-240001',
      service: 'Wash & Fold',
      status: 'delivered',
      items: 8,
      price: 320,
      date: '18 March 2026'
    }
  ];
  */

  const menuItems: MenuItem[] = [
    {
      id: 'addresses',
      label: 'Saved Addresses',
      action: 'addresses',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
            stroke="#0F2E2A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="3" stroke="#0F2E2A" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      action: 'payment',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="4" width="22" height="16" rx="2" stroke="#0F2E2A" strokeWidth="2"/>
          <path d="M1 10H23" stroke="#0F2E2A" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      action: 'notifications',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      )
    },
    {
      id: 'help',
      label: 'Help & Support',
      action: 'help',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#0F2E2A" strokeWidth="2"/>
          <path 
            d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" 
            stroke="#0F2E2A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="17" r="0.5" fill="#0F2E2A" stroke="#0F2E2A" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: 'about',
      label: 'About Rapidry',
      action: 'about',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#0F2E2A" strokeWidth="2"/>
          <path d="M12 16V12" stroke="#0F2E2A" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="0.5" fill="#0F2E2A" stroke="#0F2E2A" strokeWidth="1"/>
        </svg>
      )
    },
    {
      id: 'signout',
      label: 'Sign Out',
      action: 'signout',
      destructive: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
            stroke="#991B1B" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M16 17L21 12L16 7" 
            stroke="#991B1B" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M21 12H9" 
            stroke="#991B1B" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )
    }
  ];

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return {
          background: '#ECFDF5',
          color: '#15803D',
          border: '1px solid #15803D',
          label: 'Delivered'
        };
      case 'processing':
        return {
          background: 'rgba(214,185,123,0.12)',
          color: '#D6B97B',
          border: '1px solid rgba(214,185,123,0.30)',
          label: 'Processing'
        };
      default:
        return {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #92400E',
          label: 'Pending'
        };
    }
  };

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#F3EFE6]">
      {/* Header */}
      <div 
        className="sticky top-0 z-50 bg-[#F3EFE6]"
        style={{ 
          paddingTop: '47px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '16px'
        }}
      >
        <div className="flex items-center justify-between">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#0F2E2A',
              lineHeight: 1.2
            }}
          >
            My Account
          </h1>

          {/* Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #D6B97B',
              background: 'linear-gradient(135deg, #D6B97B 0%, #E8D4A8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0F2E2A'
            }}
          >
            NS
          </div>
        </div>

        {/* Tab Bar */}
        <div
          className="mt-4"
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '4px'
          }}
        >
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('orders')}
              className="flex-1 transition-all"
              style={{
                background: activeTab === 'orders' ? '#0F2E2A' : 'transparent',
                color: activeTab === 'orders' ? '#FFFFFF' : '#9CAB9A',
                borderRadius: '10px',
                padding: '10px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: activeTab === 'orders' ? 600 : 400,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="flex-1 transition-all"
              style={{
                background: activeTab === 'profile' ? '#0F2E2A' : 'transparent',
                color: activeTab === 'profile' ? '#FFFFFF' : '#9CAB9A',
                borderRadius: '10px',
                padding: '10px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: activeTab === 'profile' ? 600 : 400,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: 'calc(844px - 155px)',
          paddingBottom: '24px'
        }}
      >
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="px-4 mt-4 space-y-3">
            {orders.length > 0 ? (
              orders.map((order) => {
                const statusStyle = getStatusStyle(order.status);
                
                return (
                  <div
                    key={order.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0px 1px 3px rgba(15,46,42,0.08), 0px 1px 2px rgba(15,46,42,0.06)'
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Rapidry collar icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z" 
                            stroke="#0F2E2A" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                          <path 
                            d="M12 2V20" 
                            stroke="#0F2E2A" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Service name */}
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#0F2E2A'
                          }}
                        >
                          {order.service}
                        </h3>
                      </div>

                      {/* Status pill */}
                      <div
                        style={{
                          background: statusStyle.background,
                          color: statusStyle.color,
                          border: statusStyle.border,
                          borderRadius: '999px',
                          padding: '4px 10px',
                          fontFamily: 'var(--font-body)',
                          fontSize: '11px',
                          fontWeight: 500
                        }}
                      >
                        {statusStyle.label}
                      </div>
                    </div>

                    {/* Card details */}
                    <div className="flex items-center justify-between mt-2">
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 400,
                          color: '#4A5568'
                        }}
                      >
                        {order.items} items · ₹{order.price}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#9CAB9A'
                        }}
                      >
                        {order.date}
                      </p>
                    </div>

                    {/* Card footer */}
                    <div
                      className="flex items-center justify-between mt-3 pt-3"
                      style={{
                        borderTop: '0.5px solid #F3EFE6'
                      }}
                    >
                      <button
                        className="transition-opacity hover:opacity-70"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0F2E2A',
                          padding: 0
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="transition-opacity hover:opacity-70"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#D6B97B',
                          padding: 0
                        }}
                      >
                        Re-order →
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No Orders Yet"
                subtitle="You haven't placed any orders yet. Let's get started!"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12 2V20" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </svg>
                }
                variant="light"
              />
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            {/* Profile Header */}
            <div className="px-4 mt-4">
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '20px 24px'
                }}
              >
                <div className="flex items-center mb-4">
                  {/* Avatar */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '2px solid #D6B97B',
                      background: 'linear-gradient(135deg, #D6B97B 0%, #E8D4A8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0F2E2A',
                      marginRight: '16px',
                      flexShrink: 0
                    }}
                  >
                    NS
                  </div>

                  {/* User info */}
                  <div className="flex-1">
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#0F2E2A',
                        marginBottom: '4px'
                      }}
                    >
                      Nishant Sarawgi
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#4A5568',
                        marginBottom: '4px'
                      }}
                    >
                      +91 70703 11787
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#D6B97B'
                      }}
                    >
                      Member since March 2026
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-2">
                  {/* Orders */}
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: '#F3EFE6',
                      borderRadius: '12px',
                      padding: '12px 8px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#D6B97B',
                        marginBottom: '2px'
                      }}
                    >
                      12
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#4A5568'
                      }}
                    >
                      Orders
                    </p>
                  </div>

                  {/* Rating */}
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: '#F3EFE6',
                      borderRadius: '12px',
                      padding: '12px 8px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#D6B97B',
                        marginBottom: '2px'
                      }}
                    >
                      4.9 ⭐
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#4A5568'
                      }}
                    >
                      Rating
                    </p>
                  </div>

                  {/* Since */}
                  <div
                    className="flex-1 text-center"
                    style={{
                      background: '#F3EFE6',
                      borderRadius: '12px',
                      padding: '12px 8px'
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#D6B97B',
                        marginBottom: '2px'
                      }}
                    >
                      Mar
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        fontWeight: 400,
                        color: '#4A5568'
                      }}
                    >
                      Since 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu List */}
            <div className="px-4 mt-4">
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
              >
                {menuItems.map((item, index) => {
                  const isLast = index === menuItems.length - 1;
                  
                  return (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 transition-all hover:bg-[#F3EFE6] active:scale-98"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: isLast ? 'none' : '0.5px solid #F3EFE6',
                        padding: '16px 20px',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Icon circle */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: item.destructive ? '#FEE2E2' : '#F3EFE6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* Label */}
                      <p
                        className="flex-1 text-left"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '15px',
                          fontWeight: 400,
                          color: item.destructive ? '#991B1B' : '#0F2E2A'
                        }}
                      >
                        {item.label}
                      </p>

                      {/* Chevron (except for Sign Out) */}
                      {!item.destructive && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M9 18L15 12L9 6" 
                            stroke="#9CAB9A" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}