import {
  BarChart3,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Tag,
  User,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ size?: number; color?: string }>
}

interface NavSection {
  heading: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    heading: 'MAIN',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
      { label: 'Orders', to: '/orders', icon: ClipboardList },
      { label: 'Agents', to: '/management', icon: Users },
      { label: 'Partners', to: '/management', icon: Building2 },
    ],
  },
  {
    heading: 'MANAGE',
    items: [
      { label: 'Customers', to: '/management', icon: User },
      { label: 'Analytics', to: '/management', icon: BarChart3 },
      { label: 'Coupons', to: '/management', icon: Tag },
    ],
  },
  {
    heading: 'SYSTEM',
    items: [{ label: 'Settings', to: '/management', icon: Settings }],
  },
]

const getInitials = (name: string | undefined) => {
  if (!name) {
    return 'AD'
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  return (
    <aside
      style={{
        width: '240px',
        background: 'var(--color-forest-dark)',
        color: 'var(--color-cream)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '24px' }}>
        <div
          className="font-display"
          style={{
            color: 'var(--color-gold)',
            fontSize: '20px',
            fontWeight: 700,
            marginBottom: '4px',
          }}
        >
          RAPIDRY
        </div>
        <div
          className="font-body"
          style={{
            color: 'var(--color-muted)',
            fontSize: '11px',
            fontWeight: 400,
          }}
        >
          Admin Portal
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {navSections.map((section) => (
          <div key={section.heading}>
            <p
              className="font-body"
              style={{
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '1px',
                color: 'var(--color-muted)',
                padding: '24px 20px 8px',
                margin: 0,
              }}
            >
              {section.heading}
            </p>

            {section.items.map((item) => (
              <NavLink
                key={`${section.heading}-${item.label}`}
                to={item.to}
                end={item.to === '/'}
                className="font-body"
                style={({ isActive }) => ({
                  width: 'calc(100% - 16px)',
                  margin: '2px 8px',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'var(--color-cream)',
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive
                    ? 'rgba(214,185,123,0.12)'
                    : 'transparent',
                  position: 'relative',
                  fontSize: '14px',
                  transition: 'background 0.2s ease, opacity 0.2s ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '8px',
                          width: '3px',
                          height: '24px',
                          borderRadius: '0 999px 999px 0',
                          background: 'var(--color-gold)',
                        }}
                      />
                    ) : null}
                    <item.icon
                      size={18}
                      color={isActive ? 'var(--color-gold)' : 'var(--color-muted)'}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div
        style={{
          borderTop: '1px solid rgba(243,239,230,0.10)',
          padding: '20px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            className="font-body"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '999px',
              background: 'var(--color-gold)',
              color: 'var(--color-forest-dark)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {getInitials(user?.name)}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              className="font-body"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-cream)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Admin'}
            </div>
            <div
              className="font-body"
              style={{
                fontSize: '11px',
                fontWeight: 400,
                color: 'var(--color-muted)',
              }}
            >
              Super Admin
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              padding: 0,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
