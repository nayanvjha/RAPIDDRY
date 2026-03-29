import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { resolveApiBaseUrl } from '../config/api';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.baseURL = await resolveApiBaseUrl();

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
    const requestConfig = error.config as
      | (InternalAxiosRequestConfig & { _discoveryRetried?: boolean })
      | undefined;

    if (!error.response && requestConfig && !requestConfig._discoveryRetried) {
      requestConfig._discoveryRetried = true;
      requestConfig.baseURL = await resolveApiBaseUrl(true);
      return api.request(requestConfig);
    }

    if (error.response?.status === 401) {
      await useAuthStore.getState().clearAuth();
      console.warn('Unauthorized request. JWT may be expired.');
    }

    return Promise.reject(error);
  }
);

export default api;
