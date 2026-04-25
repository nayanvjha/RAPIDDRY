import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { MoreVertical, X } from 'lucide-react'
import { adminApi } from '../../services/api'

type DiscountType = 'percent' | 'flat'

interface Coupon {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number | string
  min_order?: number | string
  used_count?: number | string
  usage_limit?: number | string | null
  expires_at?: string | null
  is_active?: boolean
}

interface CouponPayload {
  data?: Coupon[]
}

const unwrap = <T,>(response: T | { data?: T }): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T
  }
  return response as T
}

const randomCode = () => Math.random().toString(36).slice(2, 10).toUpperCase()

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'No expiry'
  }
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const getDerivedStatus = (coupon: Coupon): 'Active' | 'Expired' | 'Disabled' => {
  if (!coupon.is_active) {
    return 'Disabled'
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return 'Expired'
  }

  return 'Active'
}

export default function CouponsTab() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent' as DiscountType,
    discount_value: '',
    min_order: '',
    usage_limit: '',
    expires_at: '',
  })

  const fetchCoupons = async () => {
    const response = await adminApi.getCoupons()
    const payload = unwrap<CouponPayload | Coupon[]>(response)

    if (Array.isArray(payload)) {
      setCoupons(payload)
      return
    }

    setCoupons(Array.isArray(payload?.data) ? payload.data : [])
  }

  useEffect(() => {
    void fetchCoupons()
  }, [])

  const activeCount = useMemo(
    () => coupons.filter((coupon) => coupon.is_active === true).length,
    [coupons],
  )

  const handleCreateCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await adminApi.createCoupon({
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value || 0),
      min_order: Number(formData.min_order || 0),
      usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      expires_at: formData.expires_at || null,
      is_active: true,
    })

    setShowCreateModal(false)
    setFormData({
      code: '',
      discount_type: 'percent',
      discount_value: '',
      min_order: '',
      usage_limit: '',
      expires_at: '',
    })
    await fetchCoupons()
  }

  return (
    <div>
      <div style={{ margin: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="font-display" style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
          Active Coupons: {activeCount}
        </h2>

        <button
          type="button"
          className="font-body"
          onClick={() => setShowCreateModal(true)}
          style={{
            border: 'none',
            background: '#D6B97B',
            color: '#0F2E2A',
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          + Create Coupon
        </button>
      </div>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          margin: '0 32px 32px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F5F0', borderBottom: '1px solid #EAE4D8' }}>
              {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expiry', 'Status', 'Actions'].map((header) => (
                <th key={header} className="font-body" style={{ padding: '16px 20px', fontSize: '11px', fontWeight: 600, color: '#9CAB9A', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => {
              const status = getDerivedStatus(coupon)

              return (
                <tr key={coupon.id} style={{ borderBottom: '0.5px solid #F3EFE6' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 700, color: '#0F2E2A' }}>
                    {coupon.code}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="font-body" style={{ background: '#F3EFE6', color: '#0F2E2A', borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 500 }}>
                      {coupon.discount_type === 'percent' ? 'Percentage' : 'Flat'}
                    </span>
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: '#D6B97B' }}>
                    {coupon.discount_type === 'percent' ? `${Number(coupon.discount_value || 0)}%` : `₹${Number(coupon.discount_value || 0)}`}
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                    ₹{Number(coupon.min_order || 0)}
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                    {Number(coupon.used_count || 0)} / {coupon.usage_limit === null || coupon.usage_limit === undefined ? '∞' : Number(coupon.usage_limit)}
                  </td>
                  <td className="font-body" style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 400, color: '#4A5568' }}>
                    {formatDate(coupon.expires_at)}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="font-body" style={{ borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 500, background: status === 'Active' ? '#F0FDF4' : status === 'Expired' ? '#FEF2F2' : '#F3F4F6', color: status === 'Active' ? '#15803D' : status === 'Expired' ? '#991B1B' : '#6B7280', border: `1px solid ${status === 'Active' ? '#86EFAC' : status === 'Expired' ? '#FCA5A5' : '#D1D5DB'}` }}>
                      {status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button type="button" className="font-body" style={{ border: '1px solid #EAE4D8', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#0F2E2A', background: 'transparent', cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button type="button" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
                        <MoreVertical size={16} color="#9CAB9A" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showCreateModal ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'rgba(0,0,0,0.40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <form
            onSubmit={(event) => {
              void handleCreateCoupon(event)
            }}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '480px',
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0px 24px 64px rgba(15,46,42,0.20)',
              padding: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="font-display" style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0F2E2A' }}>
                Create Coupon Code
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
                <X size={20} color="#0F2E2A" />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="font-body" style={{ fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
                    Coupon Code
                  </label>
                  <button type="button" className="font-body" onClick={() => setFormData((prev) => ({ ...prev, code: randomCode() }))} style={{ border: 'none', background: 'transparent', color: '#D6B97B', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: 0 }}>
                    Generate random
                  </button>
                </div>
                <input
                  required
                  value={formData.code}
                  onChange={(event) => setFormData((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
                  className="font-body"
                  style={{ width: '100%', border: '1.5px solid #EAE4D8', borderRadius: '10px', padding: '12px 16px', fontFamily: 'Courier New, monospace', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}
                />
              </div>

              <div>
                <p className="font-body" style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: '#0F2E2A' }}>
                  Discount Type
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { value: 'percent', label: 'Percentage %' },
                    { value: 'flat', label: 'Flat Amount ₹' },
                  ].map((option) => {
                    const isSelected = formData.discount_type === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="font-body"
                        onClick={() => setFormData((prev) => ({ ...prev, discount_type: option.value as DiscountType }))}
                        style={{
                          flex: 1,
                          borderRadius: '999px',
                          border: `1.5px solid ${isSelected ? '#D6B97B' : '#EAE4D8'}`,
                          background: isSelected ? '#D6B97B' : 'transparent',
                          color: isSelected ? '#0F2E2A' : '#4A5568',
                          fontSize: '14px',
                          fontWeight: 600,
                          padding: '10px 14px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(event) => {
                          if (!isSelected) {
                            event.currentTarget.style.background = 'rgba(214,185,123,0.08)'
                          }
                        }}
                        onMouseLeave={(event) => {
                          if (!isSelected) {
                            event.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <input required type="number" placeholder="Discount Value" value={formData.discount_value} onChange={(event) => setFormData((prev) => ({ ...prev, discount_value: event.target.value }))} className="font-body" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #EAE4D8', borderRadius: '10px', fontSize: '14px' }} />
                <input required type="number" placeholder="Min Order (₹)" value={formData.min_order} onChange={(event) => setFormData((prev) => ({ ...prev, min_order: event.target.value }))} className="font-body" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #EAE4D8', borderRadius: '10px', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" placeholder="Usage Limit" value={formData.usage_limit} onChange={(event) => setFormData((prev) => ({ ...prev, usage_limit: event.target.value }))} className="font-body" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #EAE4D8', borderRadius: '10px', fontSize: '14px' }} />
                <input type="date" value={formData.expires_at} onChange={(event) => setFormData((prev) => ({ ...prev, expires_at: event.target.value }))} className="font-body" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #EAE4D8', borderRadius: '10px', fontSize: '14px' }} />
              </div>

              <button type="submit" className="font-body" style={{ width: '100%', border: 'none', borderRadius: '12px', background: '#D6B97B', color: '#0F2E2A', fontSize: '15px', fontWeight: 600, padding: '14px', marginTop: '8px', cursor: 'pointer' }}>
                Create Coupon
              </button>

              <button type="button" onClick={() => setShowCreateModal(false)} className="font-body" style={{ width: '100%', border: '1.5px solid #EAE4D8', borderRadius: '12px', background: 'transparent', color: '#4A5568', fontSize: '14px', fontWeight: 600, padding: '12px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
