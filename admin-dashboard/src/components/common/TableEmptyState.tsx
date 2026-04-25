import { SearchX } from 'lucide-react'

interface TableEmptyStateProps {
  colSpan: number
  title?: string
  subtitle?: string
}

export default function TableEmptyState({
  colSpan,
  title = 'No orders found',
  subtitle = 'Try adjusting your filters',
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: '48px 20px' }}>
        <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <SearchX size={64} color="#9CAB9A" strokeWidth={1.6} />
          <p
            className="font-display"
            style={{
              margin: '12px 0 4px',
              fontSize: '18px',
              fontWeight: 600,
              color: '#0F2E2A',
            }}
          >
            {title}
          </p>
          <p
            className="font-body"
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 400,
              color: '#9CAB9A',
            }}
          >
            {subtitle}
          </p>
        </div>
      </td>
    </tr>
  )
}
