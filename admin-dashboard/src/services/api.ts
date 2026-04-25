import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TOKEN_KEY = 'rapidry_admin_token'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)

export interface DashboardOrderParams {
  status?: string
  search?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

export interface CustomerParams {
  search?: string
  page?: number
  limit?: number
}

export interface CreateAgentPayload {
  name: string
  phone: string
  email?: string
  zone?: string
}

export interface CreateCouponPayload {
  code: string
  discount_type: 'flat' | 'percent'
  discount_value: number
  min_order?: number
  max_discount?: number | null
  expires_at?: string | null
  usage_limit?: number | null
  is_active?: boolean
}

export type UpdateCouponPayload = Partial<CreateCouponPayload>

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/admin-login', { email, password })
    return response.data
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics')
    return response.data
  },

  getOrders: async (params?: DashboardOrderParams) => {
    const response = await api.get('/admin/orders', { params })
    return response.data
  },

  getOrderDetail: async (id: string) => {
    const response = await api.get(`/admin/orders/${id}`)
    return response.data
  },

  assignAgent: async (orderId: string, agentId: string) => {
    const response = await api.patch(`/admin/orders/${orderId}/assign`, {
      agent_id: agentId,
    })
    return response.data
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/orders/${id}/status`, { status })
    return response.data
  },

  getAgents: async () => {
    const response = await api.get('/admin/agents')
    return response.data
  },

  createAgent: async (data: CreateAgentPayload) => {
    const response = await api.post('/admin/agents', data)
    return response.data
  },

  suspendAgent: async (id: string) => {
    const response = await api.patch(`/admin/agents/${id}/suspend`)
    return response.data
  },

  getCustomers: async (params?: CustomerParams) => {
    const response = await api.get('/admin/customers', { params })
    return response.data
  },

  getPartners: async () => {
    const response = await api.get('/admin/partners')
    return response.data
  },

  getCoupons: async () => {
    const response = await api.get('/admin/coupons')
    return response.data
  },

  createCoupon: async (data: CreateCouponPayload) => {
    const response = await api.post('/admin/coupons', data)
    return response.data
  },

  updateCoupon: async (id: string, data: UpdateCouponPayload) => {
    const response = await api.patch(`/admin/coupons/${id}`, data)
    return response.data
  },

  deleteCoupon: async (id: string) => {
    const response = await api.delete(`/admin/coupons/${id}`)
    return response.data
  },

  getServices: async () => {
    const response = await api.get('/admin/services')
    return response.data
  },

  updateServicePricing: async (id: string, price: number) => {
    const response = await api.put(`/admin/services/${id}`, { price })
    return response.data
  },
}
