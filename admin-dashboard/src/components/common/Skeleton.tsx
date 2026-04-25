import type { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: CSSProperties
}

export default function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  return (
    <div
      className="rapidry-pulse"
      style={{
        width,
        height,
        borderRadius,
        background: '#F3EFE6',
        ...style,
      }}
    />
  )
}
