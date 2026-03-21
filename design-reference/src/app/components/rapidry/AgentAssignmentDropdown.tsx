import React, { useState, useRef, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  distance: number;
  tasksToday: number;
  rating: number;
  isOnline: boolean;
}

interface AgentAssignmentDropdownProps {
  onAssign: (agentId: string) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export function AgentAssignmentDropdown({ onAssign, onClose, anchorEl }: AgentAssignmentDropdownProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock agent data
  const agents: Agent[] = [
    { id: '1', name: 'Ravi Kumar', initials: 'RK', avatar: '#0F2E2A', distance: 1.2, tasksToday: 2, rating: 4.8, isOnline: true },
    { id: '2', name: 'Amit Singh', initials: 'AS', avatar: '#0F2E2A', distance: 0.8, tasksToday: 3, rating: 4.9, isOnline: true },
    { id: '3', name: 'Suresh Das', initials: 'SD', avatar: '#0F2E2A', distance: 2.1, tasksToday: 1, rating: 4.7, isOnline: true },
    { id: '4', name: 'Vikram Patel', initials: 'VP', avatar: '#0F2E2A', distance: 3.5, tasksToday: 4, rating: 4.6, isOnline: true },
    { id: '5', name: 'Rajesh Mehta', initials: 'RM', avatar: '#0F2E2A', distance: 1.9, tasksToday: 2, rating: 4.5, isOnline: false }
  ];

  const onlineAgents = agents.filter(agent => agent.isOnline);

  // Position dropdown below anchor element
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (anchorEl && dropdownRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      let top = anchorRect.bottom + 4;
      let left = anchorRect.left;

      // Ensure dropdown doesn't go off screen
      if (left + 280 > window.innerWidth) {
        left = window.innerWidth - 280 - 16;
      }

      if (top + dropdownRect.height > window.innerHeight) {
        top = anchorRect.top - dropdownRect.height - 4;
      }

      setPosition({ top, left });
    }
  }, [anchorEl]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '280px',
        maxHeight: '240px',
        background: '#FFFFFF',
        border: '1px solid #EAE4D8',
        borderRadius: '12px',
        boxShadow: '0px 12px 32px rgba(0,0,0,0.12), 0px 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid #EAE4D8'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#0F2E2A'
          }}
        >
          Select Agent
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 400,
            color: '#9CAB9A'
          }}
        >
          {onlineAgents.length} online now
        </span>
      </div>

      {/* Agent List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px'
        }}
      >
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            disabled={!agent.isOnline}
            className="w-full transition-all"
            style={{
              height: '56px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: selectedAgentId === agent.id ? '#0F2E2A' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: agent.isOnline ? 'pointer' : 'not-allowed',
              opacity: agent.isOnline ? 1 : 0.5,
              textAlign: 'left',
              marginBottom: '2px'
            }}
            onMouseEnter={(e) => {
              if (agent.isOnline && selectedAgentId !== agent.id) {
                e.currentTarget.style.background = '#F0FDFA';
              }
            }}
            onMouseLeave={(e) => {
              if (agent.isOnline && selectedAgentId !== agent.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: selectedAgentId === agent.id ? '#D6B97B' : '#D6B97B',
                border: `2px solid ${selectedAgentId === agent.id ? '#D6B97B' : '#0F2E2A'}`,
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                color: '#0F2E2A'
              }}
            >
              {agent.initials}
            </div>

            {/* Agent Info */}
            <div className="flex-1 min-w-0">
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: selectedAgentId === agent.id ? '#FFFFFF' : '#0F2E2A',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {agent.name}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 400,
                  color: selectedAgentId === agent.id ? '#F3EFE6' : '#9CAB9A'
                }}
              >
                {agent.distance.toFixed(1)} km away  |  {agent.tasksToday} tasks today
              </div>
            </div>

            {/* Rating or Checkmark */}
            <div className="flex-shrink-0">
              {selectedAgentId === agent.id ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#D6B97B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#D6B97B'
                  }}
                >
                  {agent.rating}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Assign Button */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid #EAE4D8'
        }}
      >
        <button
          onClick={() => {
            if (selectedAgentId) {
              onAssign(selectedAgentId);
              onClose();
            }
          }}
          disabled={!selectedAgentId}
          className="w-full transition-all"
          style={{
            height: '52px',
            background: selectedAgentId ? '#D6B97B' : 'rgba(214,185,123,0.4)',
            color: '#0F2E2A',
            border: 'none',
            borderRadius: '999px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: selectedAgentId ? 'pointer' : 'not-allowed',
            opacity: selectedAgentId ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (selectedAgentId) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedAgentId) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          Assign to selected agent
        </button>
      </div>
    </div>
  );
}
