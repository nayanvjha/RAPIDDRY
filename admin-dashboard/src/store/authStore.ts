import { create } from 'zustand'
import { adminApi } from '../services/api'

const TOKEN_KEY = 'rapidry_admin_token'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: AuthUser
  }
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const initialToken = localStorage.getItem(TOKEN_KEY)

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: null,
  isAuthenticated: Boolean(initialToken),

  login: async (email: string, password: string) => {
    const response = (await adminApi.login(email, password)) as LoginResponse
    const token = response.data?.token ?? null
    const user = response.data?.user ?? null

    if (!token || !user) {
      throw new Error('Invalid login response')
    }

    localStorage.setItem(TOKEN_KEY, token)
    set({
      token,
      user,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    })
    window.location.assign('/login')
  },
}))
