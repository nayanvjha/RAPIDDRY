import { useState } from 'react'
import { Construction } from 'lucide-react'
import AgentsTab from '../components/management/AgentsTab'
import CouponsTab from '../components/management/CouponsTab'
import ServiceCatalogTab from '../components/management/ServiceCatalogTab'

type ManagementTab = 'agents' | 'partners' | 'customers' | 'coupons' | 'services'

const tabs: Array<{ key: ManagementTab; label: string }> = [
  { key: 'agents', label: 'Agents' },
  { key: 'partners', label: 'Partners' },
  { key: 'customers', label: 'Customers' },
  { key: 'coupons', label: 'Coupons' },
  { key: 'services', label: 'Service Catalog' },
]

function EmptyState() {
  return (
    <div
      style={{
        minHeight: '360px',
        display: 'grid',
        placeItems: 'center',
        padding: '32px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
          <Construction size={80} color="#9CAB9A" strokeWidth={1.5} />
        </div>
        <p className="font-body" style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: '#9CAB9A' }}>
          Coming soon...
        </p>
      </div>
    </div>
  )
}

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<ManagementTab>('agents')

  return (
    <div>
      <div style={{ margin: '24px 32px 0' }}>
        <div
          style={{
            display: 'inline-flex',
            background: '#F3EFE6',
            borderRadius: '16px',
            padding: '4px',
            gap: '4px',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                className="font-body"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontSize: '14px',
                  background: isActive ? '#0F2E2A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#4A5568',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === 'agents' ? <AgentsTab /> : null}
      {activeTab === 'coupons' ? <CouponsTab /> : null}
      {activeTab === 'services' ? <ServiceCatalogTab /> : null}
      {activeTab === 'partners' ? <EmptyState /> : null}
      {activeTab === 'customers' ? <EmptyState /> : null}
    </div>
  )
}
