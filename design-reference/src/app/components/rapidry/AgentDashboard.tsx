import React, { useState } from 'react';
import { EmptyState } from './EmptyState';

interface Task {
  id: string;
  type: 'pickup' | 'drop';
  customer: string;
  address: string;
  time: string;
  items?: number;
}

interface AgentDashboardProps {
  agentName?: string;
  onNavigate?: () => void;
  onTaskDetails?: (taskId: string) => void;
}

export function AgentDashboard({ 
  agentName = "Ravi Prasad",
  onNavigate,
  onTaskDetails 
}: AgentDashboardProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeNav, setActiveNav] = useState<'home' | 'tasks' | 'earnings' | 'profile'>('home');

  const stats = [
    {
      id: 'tasks',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L22 4" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: '8',
      label: 'Tasks Today'
    },
    {
      id: 'completed',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#D6B97B" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: '5',
      label: 'Completed'
    },
    {
      id: 'earnings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#D6B97B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      value: '₹480',
      label: "Today's Earnings"
    }
  ];

  const activeTask: Task = {
    id: 'ACT-001',
    type: 'pickup',
    customer: 'Mr. Nishant Sarawgi',
    address: '02-007, Emaar Palm Square, Sector 66',
    time: '11:00 – 13:00',
    items: 4
  };

  const upcomingTasks: Task[] = [];
  // Demo data - can be empty to show EmptyState
  // Uncomment to see tasks:
  /*
  const upcomingTasks: Task[] = [
    {
      id: 'UP-001',
      type: 'pickup',
      customer: 'Mrs. Priya Sharma',
      address: 'Tower B-301, Brigade Metropolis',
      time: '14:00'
    },
    {
      id: 'UP-002',
      type: 'drop',
      customer: 'Mr. Vikram Patel',
      address: 'C-88, DLF Phase 2',
      time: '16:30'
    }
  ];
  */

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="8" y="2" width="8" height="4" rx="1" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke={active ? '#D6B97B' : '#9CAB9A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="relative w-[390px] h-[844px] overflow-hidden bg-[#0F2E2A]">
      {/* Top Bar */}
      <div 
        style={{ 
          paddingTop: '47px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px'
        }}
      >
        <div className="flex items-start justify-between">
          {/* Greeting */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.6,
                marginBottom: '2px'
              }}
            >
              Good morning,
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 600,
                color: '#F3EFE6',
                lineHeight: 1.2
              }}
            >
              {agentName}
            </h1>
          </div>

          {/* Online/Offline Toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center gap-1.5 transition-all active:scale-95"
            style={{
              background: isOnline ? '#D6B97B' : '#183F3A',
              border: isOnline ? 'none' : '1px solid #334D47',
              borderRadius: '999px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
          >
            {/* Status dot */}
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isOnline ? '#15803D' : '#9CAB9A'
              }}
            />
            {/* Status text */}
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                fontWeight: 700,
                color: isOnline ? '#0F2E2A' : '#9CAB9A',
                letterSpacing: '0.5px'
              }}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div 
        className="overflow-y-auto" 
        style={{ 
          height: 'calc(844px - 101px - 72px)',
          paddingBottom: '24px'
        }}
      >
        {/* Stats Strip */}
        <div className="px-4 flex gap-2.5">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex-1"
              style={{
                background: '#183F3A',
                borderRadius: '14px',
                padding: '14px'
              }}
            >
              <div className="mb-2">
                {stat.icon}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#F3EFE6',
                  lineHeight: 1,
                  marginBottom: '4px'
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#9CAB9A'
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Active Task Card */}
        <div className="px-4 mt-5">
          <div
            style={{
              background: 'rgba(214,185,123,0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(214,185,123,0.30)',
              borderTop: '3px solid #D6B97B',
              borderRadius: '20px',
              padding: '20px'
            }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              {/* Active pill */}
              <div
                style={{
                  background: 'rgba(214,185,123,0.15)',
                  border: '1px solid #D6B97B',
                  borderRadius: '999px',
                  padding: '4px 10px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#D6B97B',
                    letterSpacing: '1px'
                  }}
                >
                  ACTIVE PICKUP
                </span>
              </div>

              {/* Time chip */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#F3EFE6'
                }}
              >
                {activeTask.time}
              </div>
            </div>

            {/* Customer info */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: '#F3EFE6',
                marginBottom: '6px',
                lineHeight: 1.3
              }}
            >
              {activeTask.customer}
            </h2>
            
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F3EFE6',
                opacity: 0.7,
                marginBottom: '8px',
                lineHeight: 1.4
              }}
            >
              {activeTask.address}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#D6B97B',
                marginBottom: '16px'
              }}
            >
              {activeTask.items} items to collect
            </p>

            {/* Action buttons */}
            <div className="flex gap-2.5">
              {/* Navigate button */}
              <button
                onClick={onNavigate}
                className="flex-1 flex items-center justify-center gap-2 transition-all active:scale-98"
                style={{
                  background: '#D6B97B',
                  border: 'none',
                  borderRadius: '12px',
                  height: '44px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F2E2A',
                  cursor: 'pointer'
                }}
              >
                {/* Map pin icon */}
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
                Navigate
              </button>

              {/* Details button */}
              <button
                onClick={() => onTaskDetails?.(activeTask.id)}
                className="transition-all active:scale-98"
                style={{
                  background: 'transparent',
                  border: '1.5px solid #D6B97B',
                  borderRadius: '12px',
                  height: '44px',
                  width: '96px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#D6B97B',
                  cursor: 'pointer'
                }}
              >
                Details →
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="px-4 mt-6">
          {/* Section label */}
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
            Up Next
          </p>

          {/* Task cards */}
          <div className="space-y-2.5">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onTaskDetails?.(task.id)}
                  className="w-full flex items-center gap-3 transition-all hover:bg-[#1A453F] active:scale-98"
                  style={{
                    background: '#183F3A',
                    border: 'none',
                    borderLeft: `3px solid ${task.type === 'pickup' ? '#D6B97B' : '#F3EFE6'}`,
                    borderRadius: '14px',
                    padding: '14px 16px',
                    minHeight: '72px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {/* Content */}
                  <div className="flex-1">
                    {/* Type tag */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: task.type === 'pickup' ? '#D6B97B' : '#9CAB9A',
                        letterSpacing: '1px',
                        marginBottom: '4px'
                      }}
                    >
                      {task.type.toUpperCase()}
                    </p>

                    {/* Customer name */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#F3EFE6',
                        marginBottom: '3px',
                        lineHeight: 1.3
                      }}
                    >
                      {task.customer}
                    </p>

                    {/* Address */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#9CAB9A',
                        lineHeight: 1.3
                      }}
                    >
                      {task.address}
                    </p>
                  </div>

                  {/* Time and chevron */}
                  <div className="flex flex-col items-end gap-1">
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#D6B97B'
                      }}
                    >
                      {task.time}
                    </p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M9 18L15 12L9 6" 
                        stroke="#9CAB9A" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              ))
            ) : (
              <EmptyState
                title="No Upcoming Tasks"
                subtitle="You have no upcoming tasks. Please check back later."
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
                variant="dark"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-around"
        style={{
          background: '#0F2E2A',
          borderTop: '0.5px solid #183F3A',
          height: '72px',
          paddingBottom: '8px'
        }}
      >
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id as any)}
              className="flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              {item.icon(isActive)}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#D6B97B' : '#9CAB9A'
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}