import { Bell } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface TopbarProps {
  title: string
  subtitle: string
}

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

export default function Topbar({ title, subtitle }: TopbarProps) {
  const user = useAuthStore((state) => state.user)

  return (
    <header
      style={{
        height: '64px',
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          className="font-display"
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: 'var(--color-dark)',
            marginBottom: '2px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          className="font-body"
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'var(--color-muted)',
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button
          type="button"
          aria-label="Notifications"
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            position: 'relative',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Bell size={20} color="var(--color-dark)" />
          <span
            className="font-body"
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-6px',
              background: 'var(--color-error)',
              color: 'var(--color-white)',
              borderRadius: '999px',
              fontSize: '9px',
              fontWeight: 700,
              padding: '2px 5px',
              lineHeight: 1,
            }}
          >
            3
          </span>
        </button>

        <div
          className="font-body"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '999px',
            background: 'var(--color-gold)',
            color: 'var(--color-dark)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  )
}
