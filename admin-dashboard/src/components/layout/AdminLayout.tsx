import { format } from 'date-fns'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const getTopbarCopy = (pathname: string) => {
  if (pathname === '/') {
    return {
      title: 'Dashboard',
      subtitle: format(new Date(), 'EEEE, dd MMMM yyyy'),
    }
  }

  if (pathname === '/orders') {
    return {
      title: 'Orders',
      subtitle: 'Manage all customer orders',
    }
  }

  if (pathname.startsWith('/management')) {
    return {
      title: 'Management',
      subtitle: 'Manage agents, coupons, and services',
    }
  }

  return {
    title: 'Dashboard',
    subtitle: format(new Date(), 'EEEE, dd MMMM yyyy'),
  }
}

export default function AdminLayout() {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const topbarCopy = getTopbarCopy(location.pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Topbar title={topbarCopy.title} subtitle={topbarCopy.subtitle} />
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px',
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
