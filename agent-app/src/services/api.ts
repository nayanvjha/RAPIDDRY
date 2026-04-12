import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { resolveApiBaseUrl } from '../config/api';
import { useAgentAuthStore } from '../store/authStore';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const baseApiUrl = await resolveApiBaseUrl();
    config.baseURL = `${baseApiUrl}/agent`;

    const token = useAgentAuthStore.getState().token;

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
      const refreshedApiUrl = await resolveApiBaseUrl(true);
      requestConfig.baseURL = `${refreshedApiUrl}/agent`;
      return api.request(requestConfig);
    }

    if (error.response?.status === 401) {
      await useAgentAuthStore.getState().clearAuth();
      console.warn('Unauthorized request. Agent JWT may be expired.');
    }

    return Promise.reject(error);
  }
);

export default api;
