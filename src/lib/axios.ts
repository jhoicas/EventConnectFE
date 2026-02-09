import axios from 'axios';

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'hhttps://eventconnect-api-8oih6.ondigitalocean.app/api';

const API_BASE_URL = RAW_API_BASE_URL.endsWith('/api')
  ? RAW_API_BASE_URL
  : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si es un error de autenticación (no de autorización)
      const isAuthError = error.response?.data?.message?.toLowerCase().includes('token') ||
                          error.response?.data?.message?.toLowerCase().includes('autenticación') ||
                          error.response?.data?.error?.toLowerCase().includes('token');
      
      if (isAuthError) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
