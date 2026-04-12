import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { create } from 'zustand';

import { resolveApiBaseUrl } from '../config/api';

type AgentUser = {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  role: string;
  avatar_url: string | null;
};

type AuthState = {
  user: AgentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AgentUser, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AUTH_KEY = 'rapidry_agent_jwt';

export const useAgentAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync(AUTH_KEY, token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });

    const token = await SecureStore.getItemAsync(AUTH_KEY);
    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const apiBaseUrl = await resolveApiBaseUrl();
      const response = await axios.get<{ success: boolean; data: AgentUser }>(
        `${apiBaseUrl}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        user: response.data.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        try {
          const refreshedBaseUrl = await resolveApiBaseUrl(true);
          const retryResponse = await axios.get<{ success: boolean; data: AgentUser }>(
            `${refreshedBaseUrl}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          set({
            user: retryResponse.data.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        } catch {
          // Fall through to clear stale auth state.
        }
      }

      await get().clearAuth();
    }
  },
}));
