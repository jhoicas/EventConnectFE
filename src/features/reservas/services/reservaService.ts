import axios from '@/lib/axios';
import type { Reserva, CreateReservaDto, UpdateReservaDto } from '@/types';

const BASE_URL = '/reservas';

export const reservaService = {
  getAll: async (): Promise<Reserva[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Reserva> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (reserva: CreateReservaDto): Promise<Reserva> => {
    const { data } = await axios.post(BASE_URL, reserva);
    return data;
  },

  update: async (reserva: UpdateReservaDto): Promise<Reserva> => {
    const { data } = await axios.put(`${BASE_URL}/${reserva.id}`, reserva);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
