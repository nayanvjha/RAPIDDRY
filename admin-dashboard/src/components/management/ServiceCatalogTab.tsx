import { useEffect, useMemo, useState } from 'react'
import { Check, Crown, Flame, Package, Pencil, Shirt, Sparkles, X, Zap } from 'lucide-react'
import { adminApi } from '../../services/api'

interface Service {
  id: string
  name: string
  price: number | string
  unit?: string
  is_active?: boolean
}

interface ServicePayload {
  data?: Service[]
}

const unwrap = <T,>(response: T | { data?: T }): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T
  }
  return response as T
}

const iconForService = (name: string) => {
  const normalized = name.toLowerCase()

  if (normalized.includes('wash')) {
    return Shirt
  }
  if (normalized.includes('dry')) {
    return Sparkles
  }
  if (normalized.includes('premium')) {
    return Crown
  }
  if (normalized.includes('express')) {
    return Zap
  }
  if (normalized.includes('fold')) {
    return Package
  }
  if (normalized.includes('iron') || normalized.includes('steam')) {
    return Flame
  }

  return Shirt
}

export default function ServiceCatalogTab() {
  const [services, setServices] = useState<Service[]>([])
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null)
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({})

  const fetchServices = async () => {
    const response = await adminApi.getServices()
    const payload = unwrap<ServicePayload | Service[]>(response)
    const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
    setServices(list)

    setActiveMap((prev) => {
      const next = { ...prev }
      list.forEach((service) => {
        if (!(service.id in next)) {
          next[service.id] = Boolean(service.is_active)
        }
      })
      return next
    })
  }

  useEffect(() => {
    void fetchServices()
  }, [])

  const cards = useMemo(() => {
    if (services.length === 0) {
      return []
    }

    const padded = [...services]
    while (padded.length % 3 !== 0) {
      padded.push({
        id: `placeholder-${padded.length}`,
        name: '',
        price: 0,
        unit: '',
        is_active: false,
      })
    }

    return padded
  }, [services])

  const handleSavePrice = async (id: string) => {
    await adminApi.updateServicePricing(id, Number(editPrice || 0))
    setEditingServiceId(null)
    setEditPrice('')
    await fetchServices()
  }

  return (
    <div>
      <div style={{ margin: '20px 32px' }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
          Service Catalog
        </h2>
        <p className="font-body" style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
          Manage pricing and availability
        </p>
      </div>

      <div style={{ margin: '0 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {cards.map((service) => {
          if (!service.name) {
            return <div key={service.id} />
          }

          const Icon = iconForService(service.name)
          const isEditing = editingServiceId === service.id
          const isHovered = hoveredServiceId === service.id
          const isActive = activeMap[service.id] ?? Boolean(service.is_active)

          return (
            <article
              key={service.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
                border: `1.5px solid ${isHovered ? '#D6B97B' : '#EAE4D8'}`,
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={() => setHoveredServiceId(service.id)}
              onMouseLeave={() => setHoveredServiceId((current) => (current === service.id ? null : current))}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <Icon size={40} color="#0F2E2A" />
                  <p className="font-display" style={{ margin: '10px 0 4px', fontSize: '16px', fontWeight: 600, color: '#0F2E2A' }}>
                    {service.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMap((prev) => ({
                      ...prev,
                      [service.id]: !isActive,
                    }))
                  }}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive ? '#15803D' : '#D1D5DB',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: isActive ? '23px' : '3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '999px',
                      background: '#FFFFFF',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </button>
              </div>

              {!isEditing ? (
                <>
                  <p className="font-display" style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#D6B97B' }}>
                    ₹{Number(service.price || 0)}
                  </p>
                  <p className="font-body" style={{ margin: '2px 0 12px', fontSize: '12px', fontWeight: 400, color: '#9CAB9A' }}>
                    {service.unit || 'per piece'}
                  </p>

                  <button
                    type="button"
                    className="font-body"
                    onClick={() => {
                      setEditingServiceId(service.id)
                      setEditPrice(String(Number(service.price || 0)))
                    }}
                    style={{
                      border: '1px solid #D6B97B',
                      color: '#D6B97B',
                      borderRadius: '8px',
                      background: 'transparent',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <Pencil size={14} />
                    Edit Pricing
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: '#D6B97B' }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(event) => setEditPrice(event.target.value)}
                      className="font-display"
                      style={{ width: '100px', border: '2px solid #D6B97B', borderRadius: '8px', padding: '4px 8px', fontSize: '24px', fontWeight: 700, color: '#D6B97B', background: '#FFFBF5' }}
                    />
                  </div>
                  <p className="font-body" style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 400, color: '#9CAB9A' }}>
                    {service.unit || 'per piece'}
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="font-body"
                      onClick={() => {
                        void handleSavePrice(service.id)
                      }}
                      style={{
                        flex: 1,
                        border: 'none',
                        borderRadius: '8px',
                        background: '#D6B97B',
                        color: '#0F2E2A',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      type="button"
                      className="font-body"
                      onClick={() => {
                        setEditingServiceId(null)
                        setEditPrice('')
                      }}
                      style={{
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: '#991B1B',
                        padding: '8px 12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
