import { Check, X } from 'lucide-react'

export interface OrderItem {
  id: string
  name?: string
  service_name?: string
  quantity?: number
  total_price?: number
}

export interface OrderDelivery {
  id: string
  type?: string
  status?: string
  created_at?: string
}

export interface OrderCustomer {
  name?: string
  phone?: string
}

export interface OrderAddress {
  full_address?: string
  landmark?: string
}

export interface OrderPartner {
  name?: string
}

export interface OrderDetail {
  id: string
  order_number: string
  status: string
  total: number
  pickup_slot?: string
  customer_name?: string
  customer_phone?: string
  partner_name?: string
  service_name?: string
  agent_name?: string | null
  customer?: OrderCustomer
  address?: OrderAddress
  partner?: OrderPartner
  items?: OrderItem[]
  deliveries?: OrderDelivery[]
}

interface TimelineEvent {
  label: string
  time?: string
  state: 'completed' | 'current' | 'pending'
}

interface OrderDetailPanelProps {
  order: OrderDetail
  onClose: () => void
  onAssignAgent: (orderId: string) => void
}

const getInitials = (name: string | undefined) => {
  if (!name) {
    return 'CU'
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const toTitle = (value: string) =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const getStatusStyle = (status: string) => {
  const value = status.toLowerCase()

  if (value === 'placed') {
    return { background: 'rgba(214,185,123,0.12)', color: '#D6B97B', border: '1px solid #D6B97B' }
  }

  if (value === 'agent_assigned') {
    return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD' }
  }

  if (value === 'picked_up' || value === 'out_for_delivery') {
    return { background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' }
  }

  if (value === 'at_partner' || value === 'processing') {
    return { background: '#F3E8FF', color: '#6B21A8', border: '1px solid #C084FC' }
  }

  if (value === 'delivered') {
    return { background: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC' }
  }

  return { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' }
}

const buildTimeline = (order: OrderDetail): TimelineEvent[] => {
  const baseEvents: TimelineEvent[] = [
    {
      label: 'Order placed',
      time: order.deliveries?.[0]?.created_at,
      state: 'completed',
    },
  ]

  const deliveryEvents = (order.deliveries || []).map((delivery) => ({
    label: `${toTitle(delivery.type || 'Delivery')} ${toTitle(delivery.status || 'pending')}`,
    time: delivery.created_at,
    state: delivery.status === 'completed' ? ('completed' as const) : ('pending' as const),
  }))

  const merged = [...baseEvents, ...deliveryEvents]
  const firstPendingIndex = merged.findIndex((event) => event.state === 'pending')

  if (firstPendingIndex >= 0) {
    merged[firstPendingIndex] = {
      ...merged[firstPendingIndex],
      state: 'current',
    }
  }

  return merged
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0))

export default function OrderDetailPanel({ order, onClose, onAssignAgent }: OrderDetailPanelProps) {
  const statusStyle = getStatusStyle(order.status)
  const timelineEvents = buildTimeline(order)
  const items = order.items || []

  return (
    <>
      <button
        type="button"
        aria-label="Close order detail panel"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          left: '240px',
          background: 'rgba(0,0,0,0.3)',
          border: 'none',
          zIndex: 40,
        }}
      />

      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: '#FFFFFF',
          borderLeft: '1px solid #EAE4D8',
          zIndex: 50,
          overflowY: 'auto',
          transition: 'transform 0.22s ease',
          transform: 'translateX(0)',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: '#FFFFFF',
            borderBottom: '1px solid #EAE4D8',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 2,
          }}
        >
          <div>
            <h2
              className="font-display"
              style={{
                margin: '0 0 2px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#0F2E2A',
              }}
            >
              Order Details
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: 'Courier New, monospace',
                fontSize: '13px',
                fontWeight: 600,
                color: '#9CAB9A',
              }}
            >
              {order.order_number}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.opacity = '0.7'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.opacity = '1'
            }}
          >
            <X size={20} color="#0F2E2A" />
          </button>
        </div>

        <div style={{ padding: '24px 24px 0', marginBottom: '24px' }}>
          <span
            className="font-body"
            style={{
              ...statusStyle,
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {toTitle(order.status)}
          </span>
        </div>

        <section style={{ marginBottom: '24px', padding: '0 24px' }}>
          <p
            className="font-body"
            style={{
              margin: '0 0 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#9CAB9A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Customer
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
            <div
              className="font-body"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '999px',
                background: '#D6B97B',
                color: '#0F2E2A',
                display: 'grid',
                placeItems: 'center',
                fontSize: '12px',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {getInitials(order.customer?.name || order.customer_name)}
            </div>

            <div>
              <p
                className="font-body"
                style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F2E2A' }}
              >
                {order.customer?.name || order.customer_name || 'Customer'}
              </p>
              <p
                className="font-body"
                style={{ margin: '3px 0 0', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}
              >
                {order.customer?.phone || order.customer_phone || '—'}
              </p>
            </div>
          </div>

          <p
            className="font-body"
            style={{ margin: 0, fontSize: '14px', fontWeight: 400, color: '#4A5568', lineHeight: 1.5 }}
          >
            {order.address?.full_address || 'Address not available'}
            {order.address?.landmark ? `, ${order.address.landmark}` : ''}
          </p>
        </section>

        <section
          style={{
            background: '#F7F5F0',
            borderRadius: '12px',
            padding: '16px',
            margin: '0 24px 24px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p
                className="font-body"
                style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#9CAB9A',
                  textTransform: 'uppercase',
                }}
              >
                Service
              </p>
              <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                {order.service_name || items[0]?.service_name || items[0]?.name || '—'}
              </p>
            </div>

            <div>
              <p
                className="font-body"
                style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#9CAB9A',
                  textTransform: 'uppercase',
                }}
              >
                Pickup Slot
              </p>
              <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                {order.pickup_slot || '—'}
              </p>
            </div>
          </div>

          <div style={{ margin: '12px 0', height: '1px', background: '#EAE4D8' }} />

          <div>
            <p
              className="font-body"
              style={{
                margin: '0 0 6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#9CAB9A',
                textTransform: 'uppercase',
              }}
            >
              Partner
            </p>
            <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
              {order.partner?.name || order.partner_name || '—'}
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '24px', padding: '0 24px' }}>
          <p
            className="font-body"
            style={{
              margin: '0 0 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#9CAB9A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Items ({items.length})
          </p>

          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FAFAF8',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div>
                <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#0F2E2A' }}>
                  {item.service_name || item.name || 'Item'}
                </p>
                <p className="font-body" style={{ margin: '3px 0 0', fontSize: '13px', fontWeight: 400, color: '#9CAB9A' }}>
                  × {item.quantity || 1}
                </p>
              </div>
              <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                ₹{formatPrice(item.total_price || 0)}
              </p>
            </div>
          ))}

          <div
            style={{
              borderTop: '1px solid #EAE4D8',
              marginTop: '10px',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p className="font-body" style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0F2E2A' }}>
              Total Amount
            </p>
            <p className="font-display" style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0F2E2A' }}>
              ₹{formatPrice(order.total)}
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '24px', padding: '0 24px' }}>
          {order.agent_name ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="font-body"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '999px',
                  background: '#0F2E2A',
                  color: '#F3EFE6',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {getInitials(order.agent_name)}
              </div>
              <div>
                <p className="font-body" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}>
                  {order.agent_name}
                </p>
                <p className="font-body" style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 400, color: '#9CAB9A' }}>
                  Pickup Agent
                </p>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="font-body"
              onClick={() => onAssignAgent(order.id)}
              style={{
                width: '100%',
                border: '1.5px solid #D6B97B',
                background: 'rgba(214,185,123,0.12)',
                color: '#D6B97B',
                borderRadius: '10px',
                padding: '11px 14px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Assign Agent
            </button>
          )}
        </section>

        <section style={{ marginBottom: '24px', padding: '0 24px' }}>
          <p
            className="font-body"
            style={{
              margin: '0 0 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#9CAB9A',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Order Timeline
          </p>

          {timelineEvents.map((event, index) => {
            const isCompleted = event.state === 'completed'
            const isCurrent = event.state === 'current'
            const lineColor = isCompleted ? '#86EFAC' : '#EAE4D8'

            return (
              <div key={`${event.label}-${index}`} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '999px',
                      border: isCompleted
                        ? '1px solid #86EFAC'
                        : isCurrent
                          ? '1px solid #D6B97B'
                          : '1px solid #EAE4D8',
                      background: isCompleted ? '#15803D' : isCurrent ? '#D6B97B' : '#F3EFE6',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {isCompleted ? (
                      <Check size={12} color="#FFFFFF" />
                    ) : isCurrent ? (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '999px',
                          background: '#0F2E2A',
                          display: 'inline-block',
                        }}
                      />
                    ) : null}
                  </div>

                  {index < timelineEvents.length - 1 ? (
                    <span
                      style={{
                        width: '2px',
                        height: '16px',
                        background: lineColor,
                        display: 'inline-block',
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ paddingTop: '2px', paddingBottom: '10px' }}>
                  <p className="font-body" style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
                    {event.label}
                  </p>
                  <p className="font-body" style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: 400, color: '#9CAB9A' }}>
                    {event.time ? new Date(event.time).toLocaleString() : 'Pending'}
                  </p>
                </div>
              </div>
            )
          })}
        </section>

        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="font-body"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: '#0F2E2A',
              color: '#F3EFE6',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Update Status
          </button>
          <button
            type="button"
            className="font-body"
            style={{
              flex: 1,
              padding: '12px',
              border: '1.5px solid #EAE4D8',
              borderRadius: '10px',
              background: 'transparent',
              color: '#0F2E2A',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Print
          </button>
        </div>
      </aside>
    </>
  )
}
