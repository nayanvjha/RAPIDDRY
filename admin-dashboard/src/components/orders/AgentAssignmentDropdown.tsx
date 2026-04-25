import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { adminApi } from '../../services/api'

interface Agent {
  id: string
  name?: string
  is_online?: boolean
  today_delivery_count?: number | string
  rating?: number | string
}

interface AgentResponseEnvelope {
  data?: Agent[]
}

interface AgentAssignmentDropdownProps {
  anchorEl: HTMLElement
  orderId: string
  onAssign: (orderId: string, agentId: string) => void
  onClose: () => void
}

const getInitials = (name: string | undefined) => {
  if (!name) {
    return 'AG'
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const getAgentList = (response: Agent[] | AgentResponseEnvelope) => {
  if (Array.isArray(response)) {
    return response
  }

  return Array.isArray(response?.data) ? response.data : []
}

export default function AgentAssignmentDropdown({
  anchorEl,
  orderId,
  onAssign,
  onClose,
}: AgentAssignmentDropdownProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  useEffect(() => {
    const loadAgents = async () => {
      const response = await adminApi.getAgents()
      const list = getAgentList(response)
      setAgents(list)
      const firstOnline = list.find((agent) => Boolean(agent.is_online))
      setSelectedAgentId(firstOnline?.id || null)
    }

    void loadAgents()
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !anchorEl.contains(target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [anchorEl, onClose])

  const position = useMemo(() => {
    const rect = anchorEl.getBoundingClientRect()
    const dropdownWidth = 280
    const margin = 12
    let left = rect.left
    let top = rect.bottom + 4

    if (left + dropdownWidth > window.innerWidth - margin) {
      left = window.innerWidth - dropdownWidth - margin
    }

    if (left < margin) {
      left = margin
    }

    if (top + 240 > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - 244)
    }

    return { left, top }
  }, [anchorEl])

  const onlineCount = agents.filter((agent) => Boolean(agent.is_online)).length

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        zIndex: 50,
        width: '280px',
        maxHeight: '240px',
        background: '#FFFFFF',
        border: '1px solid #EAE4D8',
        borderRadius: '12px',
        boxShadow: '0px 12px 32px rgba(0,0,0,0.12), 0px 4px 12px rgba(0,0,0,0.08)',
        top: `${position.top}px`,
        left: `${position.left}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid #EAE4D8',
        }}
      >
        <p
          className="font-body"
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: '#0F2E2A',
          }}
        >
          Select Agent
        </p>
        <p
          className="font-body"
          style={{
            margin: '4px 0 0',
            fontSize: '12px',
            fontWeight: 400,
            color: '#9CAB9A',
          }}
        >
          {onlineCount} online now
        </p>
      </div>

      <div style={{ padding: '4px', overflowY: 'auto' }}>
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id
          const isOffline = !agent.is_online

          return (
            <button
              key={agent.id}
              type="button"
              disabled={isOffline}
              onClick={() => setSelectedAgentId(agent.id)}
              style={{
                width: '100%',
                height: '56px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '8px',
                marginBottom: '2px',
                border: 'none',
                cursor: isOffline ? 'not-allowed' : 'pointer',
                opacity: isOffline ? 0.5 : 1,
                background: isSelected ? '#0F2E2A' : '#FFFFFF',
              }}
              onMouseEnter={(event) => {
                if (!isSelected && !isOffline) {
                  event.currentTarget.style.background = '#F0FDFA'
                }
              }}
              onMouseLeave={(event) => {
                if (!isSelected && !isOffline) {
                  event.currentTarget.style.background = '#FFFFFF'
                }
              }}
            >
              <div
                className="font-body"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '999px',
                  background: '#D6B97B',
                  color: '#0F2E2A',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {getInitials(agent.name)}
              </div>

              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p
                  className="font-body"
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isSelected ? '#FFFFFF' : '#0F2E2A',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {agent.name || 'Agent'}
                </p>
                <p
                  className="font-body"
                  style={{
                    margin: '3px 0 0',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: isSelected ? '#F3EFE6' : '#9CAB9A',
                  }}
                >
                  {Number(agent.today_delivery_count || 0)} tasks today
                </p>
              </div>

              {isSelected ? (
                <Check size={16} color="#D6B97B" />
              ) : (
                <span
                  className="font-body"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#D6B97B',
                  }}
                >
                  {Number(agent.rating || 0).toFixed(1)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div
        style={{
          padding: '10px 14px',
          borderTop: '1px solid #EAE4D8',
        }}
      >
        <button
          type="button"
          disabled={!selectedAgentId}
          onClick={() => {
            if (selectedAgentId) {
              onAssign(orderId, selectedAgentId)
            }
          }}
          className="font-body"
          style={{
            width: '100%',
            height: '44px',
            border: 'none',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            background: '#D6B97B',
            color: '#0F2E2A',
            cursor: selectedAgentId ? 'pointer' : 'not-allowed',
            opacity: selectedAgentId ? 1 : 0.4,
          }}
        >
          Assign to selected agent
        </button>
      </div>
    </div>
  )
}
