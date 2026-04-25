import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Star } from 'lucide-react'
import { adminApi } from '../../services/api'

interface AgentRow {
  id: string
  name?: string
  phone?: string
  is_online?: boolean
  today_delivery_count?: number | string
  rating?: number | string
  is_active?: boolean
  zone?: string | null
}

interface AgentPayload {
  data?: AgentRow[]
}

const unwrap = <T,>(response: T | { data?: T }): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T
  }
  return response as T
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

const getKycStatus = (agent: AgentRow): 'Verified' | 'Pending' | 'Rejected' => {
  if (agent.is_active === true) {
    return 'Verified'
  }

  if (agent.is_active === false) {
    return 'Pending'
  }

  return 'Rejected'
}

export default function AgentsTab() {
  const [agents, setAgents] = useState<AgentRow[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zone: '',
  })

  const fetchAgents = async () => {
    const response = await adminApi.getAgents()
    const payload = unwrap<AgentPayload | AgentRow[]>(response)

    if (Array.isArray(payload)) {
      setAgents(payload)
      return
    }

    setAgents(Array.isArray(payload?.data) ? payload.data : [])
  }

  useEffect(() => {
    void fetchAgents()
  }, [])

  const stats = useMemo(() => {
    const online = agents.filter((agent) => Boolean(agent.is_online)).length
    const offline = agents.filter((agent) => !agent.is_online).length
    const pending = agents.filter((agent) => agent.is_active === false).length

    return { online, offline, pending }
  }, [agents])

  const handleCreateAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await adminApi.createAgent({
      name: formData.name,
      phone: formData.phone,
      zone: formData.zone || undefined,
    })

    setFormData({ name: '', phone: '', zone: '' })
    setShowCreateModal(false)
    await fetchAgents()
  }

  const handleSuspendAgent = async (id: string) => {
    await adminApi.suspendAgent(id)
    await fetchAgents()
  }

  return (
    <div>
      <div
        style={{
          margin: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          className="font-display"
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: '#0F2E2A',
          }}
        >
          {agents.length} Agents
        </h2>

        <button
          type="button"
          className="font-body"
          onClick={() => setShowCreateModal(true)}
          style={{
            border: 'none',
            background: '#D6B97B',
            color: '#0F2E2A',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          + Add Agent
        </button>
      </div>

      <div
        style={{
          margin: '0 32px 20px',
          display: 'flex',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #EAE4D8' }}>
          <p className="font-body" style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Online
          </p>
          <p className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#15803D' }}>
            {stats.online}
          </p>
        </div>

        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #EAE4D8' }}>
          <p className="font-body" style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Offline
          </p>
          <p className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#4A5568' }}>
            {stats.offline}
          </p>
        </div>

        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1.5px solid #D6B97B' }}>
          <p className="font-body" style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pending Approval
          </p>
          <p className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#D6B97B' }}>
            {stats.pending}
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          margin: '0 32px 32px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
              {['Photo', 'Name', 'Phone', 'Status', "Today's Tasks", 'Rating', 'KYC Status', 'Actions'].map((header) => (
                <th key={header} className="font-body" style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => {
              const kycStatus = getKycStatus(agent)

              return (
                <tr key={agent.id} style={{ borderBottom: '0.5px solid #F3EFE6' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div className="font-body" style={{ width: '36px', height: '36px', borderRadius: '999px', background: '#D6B97B', color: '#0F2E2A', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 600 }}>
                      {getInitials(agent.name)}
                    </div>
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                    {agent.name || 'Agent'}
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                    {agent.phone || '—'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="font-body" style={{ background: agent.is_online ? '#F0FDF4' : '#F3F4F6', color: agent.is_online ? '#15803D' : '#6B7280', border: `1px solid ${agent.is_online ? '#86EFAC' : '#D1D5DB'}`, borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '999px', background: agent.is_online ? '#15803D' : '#6B7280' }} />
                      {agent.is_online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                    {Number(agent.today_delivery_count || 0)}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={16} color="#D6B97B" fill="#D6B97B" />
                      <span className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
                        {Number(agent.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="font-body" style={{ borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px', background: kycStatus === 'Verified' ? '#F0FDF4' : kycStatus === 'Pending' ? 'rgba(214,185,123,0.12)' : '#FEF2F2', color: kycStatus === 'Verified' ? '#15803D' : kycStatus === 'Pending' ? '#D6B97B' : '#991B1B', border: `1px solid ${kycStatus === 'Verified' ? '#86EFAC' : kycStatus === 'Pending' ? '#D6B97B' : '#FCA5A5'}` }}>
                      {kycStatus === 'Verified' ? '✓ ' : ''}
                      {kycStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button type="button" className="font-body" style={{ border: '1px solid #EAE4D8', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#0F2E2A', background: 'transparent', cursor: 'pointer' }} onMouseEnter={(event) => { event.currentTarget.style.background = '#F3EFE6' }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent' }}>
                        View
                      </button>
                      <button type="button" className="font-body" onClick={() => { void handleSuspendAgent(agent.id) }} style={{ border: '1px solid #FCA5A5', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#991B1B', background: 'transparent', cursor: 'pointer' }} onMouseEnter={(event) => { event.currentTarget.style.background = '#FEF2F2' }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent' }}>
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showCreateModal ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <form
            onSubmit={(event) => {
              void handleCreateAgent(event)
            }}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '420px',
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0px 24px 64px rgba(15,46,42,0.20)',
              padding: '28px',
            }}
          >
            <h3 className="font-display" style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
              Add Agent
            </h3>

            <div style={{ display: 'grid', gap: '14px' }}>
              <input required value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} placeholder="Agent name" className="font-body" style={{ height: '44px', border: '1.5px solid #EAE4D8', borderRadius: '10px', padding: '0 14px', fontSize: '14px' }} />
              <input required value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone number" className="font-body" style={{ height: '44px', border: '1.5px solid #EAE4D8', borderRadius: '10px', padding: '0 14px', fontSize: '14px' }} />
              <input value={formData.zone} onChange={(event) => setFormData((prev) => ({ ...prev, zone: event.target.value }))} placeholder="Zone" className="font-body" style={{ height: '44px', border: '1.5px solid #EAE4D8', borderRadius: '10px', padding: '0 14px', fontSize: '14px' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button type="button" className="font-body" onClick={() => setShowCreateModal(false)} style={{ flex: 1, height: '42px', border: '1.5px solid #EAE4D8', borderRadius: '10px', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#4A5568', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" className="font-body" style={{ flex: 1, height: '42px', border: 'none', borderRadius: '10px', background: '#D6B97B', fontSize: '14px', fontWeight: 600, color: '#0F2E2A', cursor: 'pointer' }}>
                Create Agent
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
