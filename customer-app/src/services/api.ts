import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

import { useAuthStore } from '../store/authStore';

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

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().clearAuth();
      console.warn('Unauthorized request. JWT may be expired.');
    }

    return Promise.reject(error);
  }
);

export default api;
