import { axiosInstance } from '@/lib/axios';
import type { Reserva, CreateReservaDto, UpdateReservaDto } from '@/types';

const BASE_URL = '/Reservations';

export const reservaService = {
  getAll: async (): Promise<Reserva[]> => {
    const { data } = await axiosInstance.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Reserva> => {
    const { data } = await axiosInstance.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (reserva: CreateReservaDto): Promise<Reserva> => {
    const { data } = await axiosInstance.post(BASE_URL, reserva);
    return data;
  },

  update: async (reserva: UpdateReservaDto): Promise<Reserva> => {
    const { data } = await axiosInstance.put(`${BASE_URL}/${reserva.id}`, reserva);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
  },

  // Cancelar reserva
  cancelarReserva: async (id: number, razon: string): Promise<{ mensaje: string }> => {
    const { data } = await axiosInstance.post(`${BASE_URL}/${id}/cancel`, { razon });
    return data;
  },

  // Verificar disponibilidad
  checkAvailability: async (empresaId: number, fechaEvento: string): Promise<{ disponible: boolean; detalles?: string }> => {
    const { data } = await axiosInstance.get(`${BASE_URL}/check-availability`, {
      params: {
        empresaId,
        fechaEvento,
      },
    });
    return data;
  },

  // Actualizar estado de reserva
  updateStatus: async (
    id: number,
    estado: string,
    observaciones?: string
  ): Promise<Reserva> => {
    const { data } = await axiosInstance.put(`${BASE_URL}/${id}/status`, {
      estado,
      observaciones,
    });
    return data;
  },

  // Obtener estadísticas de reservas
  getStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get(`${BASE_URL}/stats`);
    return data;
  },
};
