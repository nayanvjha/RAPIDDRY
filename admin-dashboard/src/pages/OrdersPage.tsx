import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Search,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { adminApi } from '../services/api'
import AgentAssignmentDropdown from '../components/orders/AgentAssignmentDropdown'
import OrderDetailPanel from '../components/orders/OrderDetailPanel'
import type { OrderDetail } from '../components/orders/OrderDetailPanel'

type StatusFilter =
  | 'all'
  | 'placed'
  | 'processing'
  | 'picked_up'
  | 'out_for_delivery'
  | 'at_partner'
  | 'delivered'
  | 'cancelled'
  | 'agent_assigned'

interface Order {
  id: string
  order_number: string
  customer_name?: string | null
  service_name?: string | null
  agent_name?: string | null
  partner_name?: string | null
  status: string
  total: number
  pickup_slot?: string | null
}

interface OrdersPayload {
  orders?: Order[]
  total?: number
  page?: number
  limit?: number
}

interface ApiEnvelope<T> {
  data?: T
}

const TABLE_SHADOW = '0px 2px 8px rgba(0,0,0,0.04)'

const unwrap = <T,>(response: T | ApiEnvelope<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiEnvelope<T>).data as T
  }
  return response as T
}

const toLabel = (value: string) =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'placed') {
    return { background: 'rgba(214,185,123,0.12)', color: '#D6B97B', border: '1px solid #D6B97B' }
  }

  if (normalized === 'agent_assigned') {
    return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD' }
  }

  if (normalized === 'picked_up' || normalized === 'out_for_delivery') {
    return { background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }
  }

  if (normalized === 'at_partner' || normalized === 'processing') {
    return { background: '#F3E8FF', color: '#6B21A8', border: '1px solid #C084FC' }
  }

  if (normalized === 'delivered') {
    return { background: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC' }
  }

  return { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' }
}

const getInitials = (name: string | null | undefined) => {
  if (!name) {
    return 'NA'
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0))

export default function OrdersPage() {
  const location = useLocation()
  const panelAssignTriggerRef = useRef<HTMLButtonElement | null>(null)

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState('last_7_days')
  const [zoneFilter, setZoneFilter] = useState('all_zones')
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [assignDropdown, setAssignDropdown] = useState<{
    orderId: string
    anchorEl: HTMLElement
  } | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const status = params.get('status')

    if (status === 'placed') {
      setStatusFilter('placed')
    }
  }, [location.search])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
      setPage(1)
    }, 300)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [searchTerm])

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)

      try {
        const response = await adminApi.getOrders({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: debouncedSearch || undefined,
          page,
          limit,
        })

        const payload = unwrap<OrdersPayload>(response)
        setOrders(Array.isArray(payload?.orders) ? payload.orders : [])
        setTotalOrders(Number(payload?.total || 0))
      } finally {
        setLoading(false)
      }
    }

    void loadOrders()
  }, [statusFilter, debouncedSearch, page, limit, dateFilter, zoneFilter])

  const hasFilters =
    statusFilter !== 'all' ||
    debouncedSearch.length > 0 ||
    dateFilter !== 'last_7_days' ||
    zoneFilter !== 'all_zones'

  const startCount = totalOrders === 0 ? 0 : (page - 1) * limit + 1
  const endCount = Math.min(page * limit, totalOrders)
  const canGoPrev = page > 1
  const canGoNext = page * limit < totalOrders

  const activeFilterPills = useMemo(() => {
    const pills: Array<{ key: string; label: string; onClear: () => void }> = []

    if (statusFilter !== 'all') {
      pills.push({
        key: 'status',
        label: `Status: ${toLabel(statusFilter)}`,
        onClear: () => setStatusFilter('all'),
      })
    }

    if (debouncedSearch) {
      pills.push({
        key: 'search',
        label: `Search: ${debouncedSearch}`,
        onClear: () => setSearchTerm(''),
      })
    }

    if (zoneFilter !== 'all_zones') {
      pills.push({
        key: 'zone',
        label: `Zone: ${zoneFilter}`,
        onClear: () => setZoneFilter('all_zones'),
      })
    }

    if (dateFilter !== 'last_7_days') {
      pills.push({
        key: 'date',
        label: `Date: ${dateFilter}`,
        onClear: () => setDateFilter('last_7_days'),
      })
    }

    return pills
  }, [statusFilter, debouncedSearch, zoneFilter, dateFilter])

  const handleViewOrder = async (id: string) => {
    const response = await adminApi.getOrderDetail(id)
    const detail = unwrap<OrderDetail>(response)
    setSelectedOrder(detail)
  }

  const handleAssignAgent = async (orderId: string, agentId: string) => {
    await adminApi.assignAgent(orderId, agentId)
    setAssignDropdown(null)

    const response = await adminApi.getOrders({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: debouncedSearch || undefined,
      page,
      limit,
    })
    const payload = unwrap<OrdersPayload>(response)
    setOrders(Array.isArray(payload?.orders) ? payload.orders : [])
    setTotalOrders(Number(payload?.total || 0))
  }

  const clearAllFilters = () => {
    setStatusFilter('all')
    setSearchTerm('')
    setDateFilter('last_7_days')
    setZoneFilter('all_zones')
    setPage(1)
  }

  return (
    <div>
      <button
        ref={panelAssignTriggerRef}
        type="button"
        style={{
          position: 'fixed',
          top: '-1000px',
          left: '-1000px',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <section style={{ padding: '24px 32px 0' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: TABLE_SHADOW,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
              color="#9CAB9A"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by order ID, customer..."
              className="font-body"
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '38px',
                border: '1.5px solid #EAE4D8',
                borderRadius: '10px',
                fontSize: '14px',
                color: '#0F2E2A',
                outline: 'none',
              }}
              onFocus={(event) => {
                event.currentTarget.style.borderColor = '#D6B97B'
                event.currentTarget.style.boxShadow = '0 0 0 3px rgba(214,185,123,0.1)'
              }}
              onBlur={(event) => {
                event.currentTarget.style.borderColor = '#EAE4D8'
                event.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter)
              setPage(1)
            }}
            className="font-body"
            style={{
              width: '140px',
              height: '40px',
              border: '1.5px solid #EAE4D8',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#0F2E2A',
              padding: '0 10px',
            }}
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="picked_up">Out for Pickup</option>
            <option value="at_partner">At Partner</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            className="font-body"
            style={{
              width: '140px',
              height: '40px',
              border: '1.5px solid #EAE4D8',
              borderRadius: '10px',
              background: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#0F2E2A',
              cursor: 'pointer',
            }}
          >
            <Calendar size={14} color="#9CAB9A" />
            Last 7 days
          </button>

          <select
            value={zoneFilter}
            onChange={(event) => setZoneFilter(event.target.value)}
            className="font-body"
            style={{
              width: '140px',
              height: '40px',
              border: '1.5px solid #EAE4D8',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#0F2E2A',
              padding: '0 10px',
            }}
          >
            <option value="all_zones">All Zones</option>
            <option value="Sector 1-15">Sector 1-15</option>
            <option value="Sector 34-48">Sector 34-48</option>
            <option value="DLF Phase 1-5">DLF Phase 1-5</option>
          </select>

          <div style={{ flex: 1 }} />

          <button
            type="button"
            className="font-body"
            style={{
              height: '40px',
              padding: '0 16px',
              border: '1.5px solid #D6B97B',
              borderRadius: '10px',
              background: 'transparent',
              color: '#D6B97B',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = 'rgba(214,185,123,0.08)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = 'transparent'
            }}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            className="font-body"
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              borderRadius: '10px',
              background: '#0F2E2A',
              color: '#F3EFE6',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New Order
          </button>
        </div>
      </section>

      {hasFilters ? (
        <section style={{ padding: '8px 32px 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {activeFilterPills.map((pill) => (
            <span
              key={pill.key}
              className="font-body"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#D6B97B',
                color: '#0F2E2A',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {pill.label}
              <button
                type="button"
                onClick={pill.onClear}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#0F2E2A',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={clearAllFilters}
            className="font-body"
            style={{
              border: '1.5px solid #D6B97B',
              color: '#D6B97B',
              background: 'transparent',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        </section>
      ) : null}

      <section
        style={{
          margin: '16px 32px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: TABLE_SHADOW,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
            <tr>
              {['#', 'Order ID', 'Customer', 'Service', 'Pickup Slot', 'Agent', 'Partner', 'Status', 'Amount', 'Action'].map(
                (title, index) => (
                  <th
                    key={title}
                    className="font-body"
                    style={{
                      padding: index === 0 ? '0 20px' : '0 12px',
                      height: '44px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9CAB9A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="font-body" style={{ padding: '28px 20px', fontSize: '14px', color: '#9CAB9A' }}>
                  Loading orders...
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const isAssigned = Boolean(order.agent_name)

                return (
                  <tr
                    key={order.id}
                    style={{
                      height: '60px',
                      borderBottom: '0.5px solid #F3EFE6',
                      borderLeft: isAssigned ? '3px solid transparent' : '3px solid #D6B97B',
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = isAssigned ? '#FAFAF8' : '#FFFBF0'
                      if (isAssigned) {
                        event.currentTarget.style.borderLeftColor = '#D6B97B'
                      }
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = 'transparent'
                      event.currentTarget.style.borderLeftColor = isAssigned ? 'transparent' : '#D6B97B'
                    }}
                  >
                    <td className="font-body" style={{ padding: '0 20px', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td style={{ padding: '0 12px', width: '100px' }}>
                      <span
                        style={{
                          fontFamily: 'Courier New, monospace',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0F2E2A',
                        }}
                      >
                        {order.order_number}
                      </span>
                    </td>
                    <td style={{ padding: '0 12px', width: '160px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="font-body"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '999px',
                            background: '#D6B97B',
                            color: '#0F2E2A',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '10px',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(order.customer_name)}
                        </span>
                        <span className="font-body" style={{ fontSize: '14px', fontWeight: 400, color: '#0F2E2A' }}>
                          {order.customer_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0 12px', width: '120px' }}>
                      <span
                        className="font-body"
                        style={{
                          background: '#F3EFE6',
                          color: '#0F2E2A',
                          borderRadius: '999px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 500,
                          display: 'inline-block',
                        }}
                      >
                        {order.service_name || '—'}
                      </span>
                    </td>
                    <td className="font-body" style={{ padding: '0 12px', width: '140px', fontSize: '13px', fontWeight: 400, color: '#0F2E2A' }}>
                      {order.pickup_slot || '—'}
                    </td>
                    <td style={{ padding: '0 12px', width: '140px' }}>
                      {order.agent_name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className="font-body"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: '#0F2E2A',
                              color: '#F3EFE6',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: '11px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(order.agent_name)}
                          </span>
                          <span className="font-body" style={{ fontSize: '13px', fontWeight: 400, color: '#0F2E2A' }}>
                            {order.agent_name}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="font-body"
                          onClick={(event) =>
                            setAssignDropdown({
                              orderId: order.id,
                              anchorEl: event.currentTarget,
                            })
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#D6B97B',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Assign
                        </button>
                      )}
                    </td>
                    <td className="font-body" style={{ padding: '0 12px', width: '120px', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                      {order.partner_name || '—'}
                    </td>
                    <td style={{ padding: '0 12px', width: '120px' }}>
                      <span
                        className="font-body"
                        style={{
                          ...getStatusStyles(order.status),
                          borderRadius: '999px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 500,
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {toLabel(order.status)}
                      </span>
                    </td>
                    <td className="font-body" style={{ padding: '0 12px', width: '80px', fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                      ₹{formatAmount(order.total)}
                    </td>
                    <td style={{ padding: '0 12px', width: '100px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="font-body"
                          onClick={() => {
                            void handleViewOrder(order.id)
                          }}
                          style={{
                            border: '1px solid #EAE4D8',
                            borderRadius: '6px',
                            background: 'transparent',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#0F2E2A',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.background = '#F3EFE6'
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.background = 'transparent'
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <MoreVertical size={16} color="#9CAB9A" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p className="font-body" style={{ margin: 0, fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
            Showing {startCount}-{endCount} of {totalOrders} orders
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              style={{
                height: '32px',
                padding: '0 10px',
                border: '1px solid #EAE4D8',
                borderRadius: '8px',
                background: '#FFFFFF',
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                opacity: canGoPrev ? 1 : 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                height: '32px',
                padding: '0 10px',
                border: '1px solid #EAE4D8',
                borderRadius: '8px',
                background: '#FFFFFF',
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                opacity: canGoNext ? 1 : 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {assignDropdown ? (
        <AgentAssignmentDropdown
          orderId={assignDropdown.orderId}
          anchorEl={assignDropdown.anchorEl}
          onClose={() => setAssignDropdown(null)}
          onAssign={(orderId, agentId) => {
            void handleAssignAgent(orderId, agentId)
          }}
        />
      ) : null}

      {selectedOrder ? (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssignAgent={(orderId) => {
            setSelectedOrder(null)
            if (panelAssignTriggerRef.current) {
              setAssignDropdown({
                orderId,
                anchorEl: panelAssignTriggerRef.current,
              })
            }
          }}
        />
      ) : null}
    </div>
  )
}
