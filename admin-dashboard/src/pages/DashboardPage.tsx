import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { ClipboardList, Clock, IndianRupee, Users } from 'lucide-react'
import { adminApi } from '../services/api'

type ActiveFilter = 'all' | 'placed' | 'processing' | 'delivered'

interface DashboardStats {
  orders_today: number
  revenue_today: number
  active_agents: number
  pending_pickups: number
}

interface AnalyticsData {
  labels: string[]
  revenue: number[]
  orders: number[]
}

interface DashboardOrder {
  id: string
  order_number: string
  customer_name?: string | null
  service_name?: string | null
  agent_name?: string | null
  status: string
  total: number
  items?: Array<{ service_name?: string; name?: string }>
}

interface OrdersPayload {
  orders?: DashboardOrder[]
}

interface ApiEnvelope<T> {
  success?: boolean
  data?: T
}

const CARD_SHADOW = '0px 2px 8px rgba(0,0,0,0.04), 0px 1px 4px rgba(0,0,0,0.04)'

const unwrapPayload = <T,>(response: T | ApiEnvelope<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiEnvelope<T>).data as T
  }
  return response as T
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase()

  if (normalized === 'placed') {
    return {
      background: 'rgba(214,185,123,0.12)',
      color: '#D6B97B',
      border: '1px solid #D6B97B',
    }
  }

  if (normalized === 'agent_assigned' || normalized === 'processing') {
    return {
      background: '#EFF6FF',
      color: '#1D4ED8',
      border: '1px solid #93C5FD',
    }
  }

  if (normalized === 'delivered') {
    return {
      background: '#F0FDF4',
      color: '#15803D',
      border: '1px solid #86EFAC',
    }
  }

  if (normalized === 'cancelled') {
    return {
      background: '#FEF2F2',
      color: '#991B1B',
      border: '1px solid #FCA5A5',
    }
  }

  return {
    background: '#F3EFE6',
    color: '#4A5568',
    border: '1px solid #EAE4D8',
  }
}

const getFirstService = (order: DashboardOrder) => {
  if (order.service_name) {
    return order.service_name
  }

  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items[0]?.service_name || order.items[0]?.name || '—'
  }

  return '—'
}

const toTitleCase = (value: string) =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const avatarInitials = ['RK', 'AS', 'SD', 'VP', 'RM']

function SkeletonCard() {
  return (
    <div
      className="rapidry-pulse"
      style={{
        flex: 1,
        minHeight: '168px',
        borderRadius: '16px',
        background: '#F3EFE6',
      }}
    />
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    orders_today: 0,
    revenue_today: 0,
    active_agents: 0,
    pending_pickups: 0,
  })
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    labels: [],
    revenue: [],
    orders: [],
  })
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)

      try {
        const [statsResponse, analyticsResponse, ordersResponse] = await Promise.all([
          adminApi.getDashboardStats(),
          adminApi.getAnalytics(),
          adminApi.getOrders({ limit: 7 }),
        ])

        const statsPayload = unwrapPayload<DashboardStats>(statsResponse)
        const analyticsPayload = unwrapPayload<AnalyticsData>(analyticsResponse)
        const ordersPayload = unwrapPayload<OrdersPayload>(ordersResponse)

        setStats({
          orders_today: Number(statsPayload?.orders_today || 0),
          revenue_today: Number(statsPayload?.revenue_today || 0),
          active_agents: Number(statsPayload?.active_agents || 0),
          pending_pickups: Number(statsPayload?.pending_pickups || 0),
        })
        setAnalytics({
          labels: analyticsPayload?.labels || [],
          revenue: (analyticsPayload?.revenue || []).map((item) => Number(item || 0)),
          orders: (analyticsPayload?.orders || []).map((item) => Number(item || 0)),
        })
        setRecentOrders(Array.isArray(ordersPayload?.orders) ? ordersPayload.orders : [])
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') {
      return recentOrders
    }

    if (activeFilter === 'placed') {
      return recentOrders.filter((order) => order.status === 'placed')
    }

    if (activeFilter === 'processing') {
      return recentOrders.filter(
        (order) => order.status === 'processing' || order.status === 'agent_assigned',
      )
    }

    return recentOrders.filter((order) => order.status === 'delivered')
  }, [activeFilter, recentOrders])

  const weeklyRevenueTotal = analytics.revenue.reduce((sum, value) => sum + Number(value || 0), 0)
  const sparklineData = analytics.revenue.map((value, index) => ({
    label: analytics.labels[index] || `${index + 1}`,
    value: Number(value || 0),
  }))

  if (loading) {
    return (
      <div>
        <section
          style={{
            padding: '32px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </section>

        <section
          style={{
            padding: '0 32px 32px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <div
            className="rapidry-pulse"
            style={{
              flex: 1,
              minHeight: '460px',
              borderRadius: '16px',
              background: '#F3EFE6',
            }}
          />
          <div
            style={{
              width: '340px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div className="rapidry-pulse" style={{ height: '132px', borderRadius: '16px', background: '#F3EFE6' }} />
            <div className="rapidry-pulse" style={{ height: '160px', borderRadius: '16px', background: '#F3EFE6' }} />
            <div className="rapidry-pulse" style={{ height: '122px', borderRadius: '16px', background: '#F3EFE6' }} />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section
        style={{
          padding: '32px',
          display: 'flex',
          gap: '20px',
        }}
      >
        {[
          {
            icon: ClipboardList,
            value: String(stats.orders_today),
            label: "Today's Orders",
            trendText: '↑ +12%',
            trendBg: '#F0FDF4',
            trendColor: '#15803D',
            progressBg: '#D6B97B',
            progressWidth: '78%',
            valueColor: '#0F2E2A',
          },
          {
            icon: Users,
            value: String(stats.active_agents),
            label: 'Active Agents Online',
            trendText: '8/12',
            trendBg: '#EFF6FF',
            trendColor: '#1D4ED8',
            progressBg: '#D6B97B',
            progressWidth: '67%',
            valueColor: '#0F2E2A',
          },
          {
            icon: IndianRupee,
            value: `₹${formatCurrency(stats.revenue_today)}`,
            label: "Today's Revenue",
            trendText: '↑ +8%',
            trendBg: '#F0FDF4',
            trendColor: '#15803D',
            progressBg: '#D6B97B',
            progressWidth: '85%',
            valueColor: '#0F2E2A',
          },
          {
            icon: Clock,
            value: String(stats.pending_pickups),
            label: 'Pending Assignment',
            trendText: 'URGENT',
            trendBg: '#FEF2F2',
            trendColor: '#991B1B',
            progressBg: '#991B1B',
            progressWidth: '100%',
            valueColor: '#991B1B',
          },
        ].map((card) => (
          <article
            key={card.label}
            style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 24px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '999px',
                  background: '#F3EFE6',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <card.icon size={20} color="#0F2E2A" strokeWidth={2} />
              </div>
              <span
                className="font-body"
                style={{
                  borderRadius: '999px',
                  padding: '4px 10px',
                  background: card.trendBg,
                  color: card.trendColor,
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {card.trendText}
              </span>
            </div>

            <div
              className="font-display"
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1,
                color: card.valueColor,
                marginBottom: '4px',
              }}
            >
              {card.value}
            </div>

            <p
              className="font-body"
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: '#4A5568',
                margin: '0 0 12px',
              }}
            >
              {card.label}
            </p>

            <div
              style={{
                height: '3px',
                borderRadius: '999px',
                background: '#F3EFE6',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: card.progressWidth,
                  height: '100%',
                  borderRadius: '999px',
                  background: card.progressBg,
                }}
              />
            </div>
          </article>
        ))}
      </section>

      <section
        style={{
          padding: '0 32px 32px',
          display: 'flex',
          gap: '20px',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3
                className="font-display"
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#0F2E2A',
                }}
              >
                Recent Orders
              </h3>

              <button
                type="button"
                className="font-body"
                onClick={() => navigate('/orders')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#D6B97B',
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
                View all →
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {[
                { key: 'all', label: 'All' },
                { key: 'placed', label: 'Placed' },
                { key: 'processing', label: 'Processing' },
                { key: 'delivered', label: 'Delivered' },
              ].map((item) => {
                const isActive = activeFilter === item.key

                return (
                  <button
                    key={item.key}
                    type="button"
                    className="font-body"
                    onClick={() => setActiveFilter(item.key as ActiveFilter)}
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: isActive ? '#D6B97B' : '#F3EFE6',
                      color: isActive ? '#0F2E2A' : '#4A5568',
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div>
              <div
                className="font-body"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.4fr 1.1fr 1.1fr 1fr 0.8fr',
                  gap: '8px',
                  padding: '12px 8px',
                  borderBottom: '1px solid #F3EFE6',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: '#9CAB9A',
                }}
              >
                <span>Order ID</span>
                <span>Customer</span>
                <span>Service</span>
                <span>Agent</span>
                <span>Status</span>
                <span>Amount</span>
              </div>

              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.4fr 1.1fr 1.1fr 1fr 0.8fr',
                    gap: '8px',
                    padding: '16px 8px',
                    borderBottom: '1px solid #F3EFE6',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = '#FAFAF8'
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span
                    className="font-body"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#0F2E2A' }}
                  >
                    #{order.order_number}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '13px', fontWeight: 400, color: '#0F2E2A' }}
                  >
                    {order.customer_name || '—'}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '13px', fontWeight: 400, color: '#4A5568' }}
                  >
                    {getFirstService(order)}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '13px', fontWeight: 400, color: '#4A5568' }}
                  >
                    {order.agent_name || '—'}
                  </span>
                  <span>
                    <span
                      className="font-body"
                      style={{
                        ...getStatusBadgeStyle(order.status),
                        display: 'inline-block',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 500,
                      }}
                    >
                      {toTitleCase(order.status)}
                    </span>
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '14px', fontWeight: 600, color: '#0F2E2A' }}
                  >
                    ₹{formatCurrency(order.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            width: '340px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <article
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <h3
              className="font-display"
              style={{
                margin: '0 0 12px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#0F2E2A',
              }}
            >
              {stats.active_agents} agents online
            </h3>

            <div style={{ display: 'flex' }}>
              {avatarInitials.map((initials, index) => (
                <div
                  key={initials}
                  className="font-body"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '999px',
                    background: '#D6B97B',
                    color: '#0F2E2A',
                    border: '2px solid #FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    marginLeft: index === 0 ? '0' : '-8px',
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>

            <p
              className="font-body"
              style={{
                margin: '12px 0 0',
                fontSize: '13px',
                fontWeight: 400,
                color: '#4A5568',
              }}
            >
              5 on pickup · 3 idle
            </p>
          </article>

          <article
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: CARD_SHADOW,
            }}
          >
            <div
              className="font-display"
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F2E2A',
                marginBottom: '4px',
                lineHeight: 1.15,
              }}
            >
              ₹{formatCurrency(weeklyRevenueTotal)}
            </div>

            <p
              className="font-body"
              style={{
                margin: '0 0 16px',
                fontSize: '13px',
                fontWeight: 400,
                color: '#4A5568',
              }}
            >
              This week&apos;s revenue
            </p>

            <div style={{ width: '100%', height: '60px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#D6B97B"
                    strokeWidth={2}
                    fill="#F5EDDA"
                    fillOpacity={0.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article
            style={{
              background: '#0F2E2A',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <h3
              className="font-display"
              style={{
                margin: '0 0 12px',
                fontSize: '15px',
                fontWeight: 600,
                color: '#F3EFE6',
              }}
            >
              {stats.pending_pickups} orders pending agent
            </h3>

            <button
              type="button"
              className="font-body"
              onClick={() => navigate('/orders?status=placed')}
              style={{
                width: '100%',
                background: '#D6B97B',
                color: '#0F2E2A',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Assign now →
            </button>
          </article>
        </div>
      </section>
    </div>
  )
}
