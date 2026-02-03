import axiosInstance from '@/lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/Auth/login', credentials);
    return response.data;
  },

  register: async (payload: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/Auth/register', payload);
  },

  logout: async (): Promise<void> => {
    // Implementar logout en el backend si es necesario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/Auth/me');
    return response.data;
  },
};
