import { CheckCircle2, XCircle } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'

        return (
          <div
            key={toast.id}
            className="font-body"
            style={{
              minWidth: '260px',
              maxWidth: '340px',
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0px 10px 24px rgba(15,46,42,0.16)',
              borderLeft: `3px solid ${isSuccess ? '#15803D' : '#991B1B'}`,
              fontSize: '13px',
              fontWeight: 400,
              color: '#0F2E2A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
            }}
          >
            {isSuccess ? (
              <CheckCircle2 size={16} color="#15803D" />
            ) : (
              <XCircle size={16} color="#991B1B" />
            )}
            <span>{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
