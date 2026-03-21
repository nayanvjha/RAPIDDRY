import React, { useState } from 'react';
import logoIcon from 'figma:asset/f90ceb00702b22ff209113e464599d98455b80c7.png';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  serviceType: string;
  itemCount: number;
  receivedTime: string;
  status: 'received' | 'processing' | 'ready';
}

export function PartnerKanbanBoard() {
  const [currentTime, setCurrentTime] = useState('10:45 AM');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#RD-24001',
      customerName: 'Mr. Nishant S.',
      serviceType: 'Wash & Iron',
      itemCount: 4,
      receivedTime: '10:32 AM',
      status: 'received'
    },
    {
      id: '2',
      orderNumber: '#RD-24002',
      customerName: 'Mrs. Priya K.',
      serviceType: 'Dry Cleaning',
      itemCount: 6,
      receivedTime: '10:15 AM',
      status: 'received'
    },
    {
      id: '3',
      orderNumber: '#RD-24003',
      customerName: 'Mr. Rahul M.',
      serviceType: 'Premium Care',
      itemCount: 3,
      receivedTime: '09:45 AM',
      status: 'received'
    },
    {
      id: '4',
      orderNumber: '#RD-23998',
      customerName: 'Ms. Anjali G.',
      serviceType: 'Wash & Fold',
      itemCount: 8,
      receivedTime: '09:20 AM',
      status: 'processing'
    },
    {
      id: '5',
      orderNumber: '#RD-23997',
      customerName: 'Mr. Vikram P.',
      serviceType: 'Express Wash',
      itemCount: 5,
      receivedTime: '08:50 AM',
      status: 'processing'
    },
    {
      id: '6',
      orderNumber: '#RD-23995',
      customerName: 'Mrs. Sneha R.',
      serviceType: 'Dry Cleaning',
      itemCount: 7,
      receivedTime: '08:30 AM',
      status: 'ready'
    },
    {
      id: '7',
      orderNumber: '#RD-23994',
      customerName: 'Mr. Arun S.',
      serviceType: 'Wash & Iron',
      itemCount: 4,
      receivedTime: '08:15 AM',
      status: 'ready'
    }
  ]);

  const moveToProcessing = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'processing' as const } : order
    ));
  };

  const moveToReady = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'ready' as const } : order
    ));
  };

  const receivedOrders = orders.filter(o => o.status === 'received');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const OrderCard = ({ order, onAction, actionLabel, actionColor }: { 
    order: Order; 
    onAction?: () => void;
    actionLabel?: string;
    actionColor?: string;
  }) => (
    <div
      style={{
        background: order.status === 'ready' ? '#F3EFE6' : '#FFFFFF',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.06), 0px 1px 4px rgba(0,0,0,0.04)',
        borderLeft: `4px solid ${order.status === 'ready' ? '#15803D' : '#D6B97B'}`,
        marginBottom: '12px'
      }}
    >
      {/* Order Number */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '20px',
          fontWeight: 700,
          color: '#0F2E2A',
          marginBottom: '8px',
          letterSpacing: '0.3px'
        }}
      >
        {order.orderNumber}
      </div>

      {/* Customer Name */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 600,
          color: '#0F2E2A',
          marginBottom: '12px',
          lineHeight: 1.3
        }}
      >
        {order.customerName}
      </div>

      {/* Service Type */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          fontWeight: 500,
          color: '#D6B97B',
          marginBottom: '6px'
        }}
      >
        {order.serviceType}
      </div>

      {/* Items Count */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          fontWeight: 400,
          color: '#4A5568',
          marginBottom: '4px'
        }}
      >
        {order.itemCount} items
      </div>

      {/* Received Time */}
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 400,
          color: '#9CAB9A',
          marginBottom: order.status === 'ready' ? '12px' : '14px'
        }}
      >
        Received: {order.receivedTime}
      </div>

      {/* Ready Status Message */}
      {order.status === 'ready' && (
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#4A5568',
            paddingTop: '8px',
            borderTop: '1px solid #EAE4D8'
          }}
        >
          Waiting for agent...
        </div>
      )}

      {/* Action Button */}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="transition-all active:scale-95"
          style={{
            width: '100%',
            height: '52px',
            marginTop: '14px',
            background: actionColor,
            color: actionColor === '#D6B97B' ? '#0F2E2A' : '#F3EFE6',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col"
      style={{
        width: '1024px',
        height: '768px',
        background: '#F3EFE6'
      }}
    >
      {/* Top Bar */}
      <header
        className="flex items-center justify-between"
        style={{
          height: '72px',
          background: '#0F2E2A',
          padding: '0 24px'
        }}
      >
        {/* Left: Logo & App Name */}
        <div className="flex items-center gap-4">
          <img 
            src={logoIcon} 
            alt="Rapidry" 
            style={{ 
              height: '28px',
              filter: 'brightness(0) saturate(100%) invert(78%) sepia(18%) saturate(826%) hue-rotate(359deg) brightness(91%) contrast(86%)'
            }} 
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#D6B97B',
                letterSpacing: '1px'
              }}
            >
              RAPIDRY
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.6,
                marginTop: '2px'
              }}
            >
              Partner Panel
            </div>
          </div>
        </div>

        {/* Center: Partner Name */}
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            fontWeight: 600,
            color: '#F3EFE6',
            letterSpacing: '0.2px'
          }}
        >
          Suresh Laundry — Koramangala
        </div>

        {/* Right: Status & Time */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 600,
              color: '#15803D'
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>●</span>
            ONLINE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 400,
              color: '#F3EFE6',
              opacity: 0.6
            }}
          >
            {currentTime}
          </div>
        </div>
      </header>

      {/* Kanban Columns */}
      <div
        className="flex gap-4 flex-1 overflow-hidden"
        style={{
          padding: '20px'
        }}
      >
        {/* Column 1: RECEIVED */}
        <div
          style={{
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              background: '#183F3A',
              padding: '16px 20px',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#F3EFE6',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>📥</span>
              RECEIVED
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#D6B97B',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0F2E2A'
              }}
            >
              {receivedOrders.length}
            </div>
          </div>

          {/* Cards */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px'
            }}
          >
            {receivedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={() => moveToProcessing(order.id)}
                actionLabel="▶  START PROCESSING"
                actionColor="#0F2E2A"
              />
            ))}
          </div>
        </div>

        {/* Column 2: PROCESSING */}
        <div
          style={{
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              background: '#D6B97B',
              padding: '16px 20px',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0F2E2A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              PROCESSING
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0F2E2A',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 700,
                color: '#D6B97B'
              }}
            >
              {processingOrders.length}
            </div>
          </div>

          {/* Cards */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px'
            }}
          >
            {processingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={() => moveToReady(order.id)}
                actionLabel="MARK AS READY ✓"
                actionColor="#D6B97B"
              />
            ))}
          </div>
        </div>

        {/* Column 3: READY */}
        <div
          style={{
            width: '320px',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between"
            style={{
              background: '#15803D',
              padding: '16px 20px',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.3px'
              }}
            >
              <span style={{ fontSize: '20px' }}>✅</span>
              READY FOR PICKUP
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 700,
                color: '#15803D'
              }}
            >
              {readyOrders.length}
            </div>
          </div>

          {/* Cards */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px'
            }}
          >
            {readyOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer
        className="flex items-center justify-center"
        style={{
          height: '40px',
          background: '#D6B97B'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            color: '#0F2E2A',
            letterSpacing: '0.2px'
          }}
        >
          Total today: 12 orders completed
        </div>
      </footer>
    </div>
  );
}
