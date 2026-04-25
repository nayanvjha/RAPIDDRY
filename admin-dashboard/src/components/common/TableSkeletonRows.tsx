import Skeleton from './Skeleton'

interface TableSkeletonRowsProps {
  colSpan: number
  rows?: number
}

export default function TableSkeletonRows({
  colSpan,
  rows = 5,
}: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} style={{ height: '60px' }}>
          <td colSpan={colSpan} style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Skeleton height={10} borderRadius={999} style={{ flex: 1 }} />
              <Skeleton height={10} borderRadius={999} style={{ width: '22%' }} />
              <Skeleton height={10} borderRadius={999} style={{ width: '16%' }} />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
