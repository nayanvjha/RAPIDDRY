import React, { useState } from 'react';

interface Task {
  id: string;
  type: 'PICKUP' | 'DROP';
  orderId: string;
  area: string;
  earnings: number;
}

interface AgentEarningsScreenProps {
  onBack?: () => void;
}

export function AgentEarningsScreen({ onBack }: AgentEarningsScreenProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  // Sample data
  const weeklyData = [
    { day: 'M', amount: 420, date: 17 },
    { day: 'T', amount: 580, date: 18 },
    { day: 'W', amount: 360, date: 19 },
    { day: 'T', amount: 640, date: 20, isToday: true },
    { day: 'F', amount: 0, date: 21 },
    { day: 'S', amount: 0, date: 22 },
    { day: 'S', amount: 0, date: 23 }
  ];

  const tasks: Task[] = [
    { id: '#RD-2847', type: 'PICKUP', orderId: '#RD-2847', area: 'Palm Square, Sec 66', earnings: 80 },
    { id: '#RD-2845', type: 'DROP', orderId: '#RD-2845', area: 'DLF Phase 2', earnings: 80 },
    { id: '#RD-2840', type: 'PICKUP', orderId: '#RD-2840', area: 'Golf Course Road', earnings: 80 },
    { id: '#RD-2838', type: 'PICKUP', orderId: '#RD-2838', area: 'Sushant Lok', earnings: 80 },
    { id: '#RD-2835', type: 'DROP', orderId: '#RD-2835', area: 'Cyber City', earnings: 80 },
    { id: '#RD-2832', type: 'PICKUP', orderId: '#RD-2832', area: 'MG Road', earnings: 80 },
    { id: '#RD-2829', type: 'PICKUP', orderId: '#RD-2829', area: 'Sector 54', earnings: 80 },
    { id: '#RD-2827', type: 'PICKUP', orderId: '#RD-2827', area: 'DLF Phase 1', earnings: 80 }
  ];

  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#0F2E2A]">
      {/* Scrollable content */}
      <div
        className="overflow-y-auto"
        style={{
          height: '100%',
          paddingTop: '47px',
          paddingBottom: '32px'
        }}
      >
        {/* Header */}
        <div className="px-4 mb-5">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#F3EFE6',
              marginBottom: '16px'
            }}
          >
            My Earnings
          </h1>

          {/* Date Tabs */}
          <div className="flex gap-2">
            {(['today', 'week', 'month'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="transition-all active:scale-95"
                style={{
                  background: activeTab === tab ? '#D6B97B' : '#183F3A',
                  color: activeTab === tab ? '#0F2E2A' : '#9CAB9A',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Earnings Card */}
        <div className="px-4 mt-5">
          <div
            style={{
              background: '#183F3A',
              borderRadius: '20px',
              padding: '24px',
              borderTop: '3px solid #D6B97B'
            }}
          >
            {/* Label */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.6,
                marginBottom: '8px'
              }}
            >
              Today's Total
            </p>

            {/* Amount */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '52px',
                fontWeight: 700,
                color: '#D6B97B',
                lineHeight: 1.1,
                marginBottom: '8px',
                letterSpacing: '-1px'
              }}
            >
              ₹640
            </h2>

            {/* Stats */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.5
              }}
            >
              8 tasks · 6 pickups · 2 drops
            </p>
          </div>
        </div>

        {/* Weekly Mini Chart */}
        <div className="px-4 mt-4">
          <div
            style={{
              background: '#183F3A',
              borderRadius: '16px',
              padding: '20px 16px'
            }}
          >
            {/* Chart bars */}
            <div className="flex items-end justify-between gap-1.5" style={{ height: '120px' }}>
              {weeklyData.map((data, index) => {
                const heightPercent = data.amount > 0 ? (data.amount / maxAmount) * 100 : 0;
                const barHeight = data.amount > 0 ? Math.max(heightPercent * 0.8, 20) : 4;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    {/* Amount label */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 500,
                        color: data.isToday ? '#E8D4A8' : '#D6B97B',
                        marginBottom: '6px',
                        opacity: data.amount > 0 ? 1 : 0.3,
                        minHeight: '12px'
                      }}
                    >
                      {data.amount > 0 ? `₹${data.amount}` : ''}
                    </p>

                    {/* Bar */}
                    <div
                      className="w-full transition-all duration-300"
                      style={{
                        background: data.isToday ? '#E8D4A8' : '#D6B97B',
                        height: `${barHeight}px`,
                        borderRadius: '6px 6px 0 0',
                        opacity: data.amount > 0 ? 1 : 0.2
                      }}
                    />

                    {/* Day label */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 400,
                        color: data.isToday ? '#D6B97B' : '#9CAB9A',
                        marginTop: '6px'
                      }}
                    >
                      {data.day}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="px-4 mt-6">
          {/* Section Label */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#F3EFE6',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '12px'
            }}
          >
            Today's Tasks
          </p>

          {/* Task list */}
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: '#183F3A',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {/* Type tag */}
                <div
                  style={{
                    background: task.type === 'PICKUP' ? '#D6B97B' : '#F3EFE6',
                    color: '#0F2E2A',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    flexShrink: 0
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.3px'
                    }}
                  >
                    {task.type}
                  </span>
                </div>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: '#F3EFE6',
                      marginBottom: '2px'
                    }}
                  >
                    {task.orderId}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#9CAB9A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {task.area}
                  </p>
                </div>

                {/* Earnings */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#D6B97B',
                    flexShrink: 0
                  }}
                >
                  ₹{task.earnings}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Card */}
        <div className="px-4 mt-5 mb-4">
          <div
            style={{
              background: 'rgba(214,185,123,0.06)',
              border: '1px solid #D6B97B',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            {/* Payout info */}
            <div className="flex-1">
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#F3EFE6',
                  lineHeight: 1.4,
                  marginBottom: '6px'
                }}
              >
                Next Payout: Friday 21 March · ₹3,240
              </p>

              {/* Status badge */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(214,185,123,0.20)',
                  borderRadius: '999px',
                  padding: '4px 10px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#D6B97B',
                    letterSpacing: '0.3px'
                  }}
                >
                  Processing
                </span>
              </div>
            </div>

            {/* Arrow icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="#D6B97B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: '16px' }} />
      </div>
    </div>
  );
}
