import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { ConfirmationResult } from 'firebase/auth';
import { create } from 'zustand';

type AuthUser = {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  role: string;
  avatar_url: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  confirmationResult: ConfirmationResult | null;
  phoneNumber: string;
  setAuth: (user: AuthUser, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setConfirmationResult: (
    confirmationResult: ConfirmationResult | null,
    phoneNumber?: string
  ) => void;
};

const getApiBaseUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return `http://${host}:3000/api/v1`;
  }

  return 'http://localhost:3000/api/v1';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  confirmationResult: null,
  phoneNumber: '',

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('rapidry_jwt', token);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('rapidry_jwt');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      confirmationResult: null,
      phoneNumber: '',
      isLoading: false,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });

    const token = await SecureStore.getItemAsync('rapidry_jwt');
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
      const response = await axios.get<{ success: boolean; data: AuthUser }>(
        `${getApiBaseUrl()}/auth/me`,
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
      await get().clearAuth();
    }
  },

  setConfirmationResult: (confirmationResult, phoneNumber = '') => {
    set({
      confirmationResult,
      phoneNumber,
    });
  },
}));
