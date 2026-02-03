import axiosInstance from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterClienteRequest } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register as a company/provider user (Empresa)
   * POST /api/Auth/register
   */
  register: async (payload: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/auth/register', payload);
  },

  /**
   * Register as a client (Cliente)
   * POST /api/Auth/register-cliente
   */
  registerCliente: async (payload: RegisterClienteRequest): Promise<void> => {
    await axiosInstance.post('/auth/register-cliente', payload);
  },

  logout: async (): Promise<void> => {
    // Implementar logout en el backend si es necesario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};

