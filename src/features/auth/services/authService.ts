import axiosInstance from '@/lib/axios';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterEmpresaPayload, 
  RegisterClientePayload,
  // Legacy types for backward compatibility
  RegisterRequest
} from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register as a company/provider user (Empresa)
   * POST /api/Auth/register
   * @param data - Empresa registration payload
   */
  registerEmpresa: async (data: RegisterEmpresaPayload): Promise<void> => {
    await axiosInstance.post('/auth/register', data);
  },

  /**
   * Register as a client (Cliente)
   * POST /api/Auth/register-cliente
   * @param data - Cliente registration payload
   */
  registerCliente: async (data: RegisterClientePayload): Promise<void> => {
    await axiosInstance.post('/auth/register-cliente', data);
  },

  /**
   * @deprecated Use registerEmpresa instead
   * Legacy method for backward compatibility
   */
  register: async (payload: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/auth/register', payload);
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


