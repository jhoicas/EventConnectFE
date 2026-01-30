import axios from '@/lib/axios';
import type { Cotizacion, CreateCotizacionDto } from '@/types';

const BASE_URL = '/Cotizacion';

export const cotizacionService = {
  getAll: async (): Promise<Cotizacion[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Cotizacion> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (cotizacion: CreateCotizacionDto): Promise<Cotizacion> => {
    const { data } = await axios.post(BASE_URL, cotizacion);
    return data;
  },

  update: async (id: number, cotizacion: Partial<Cotizacion>): Promise<Cotizacion> => {
    const { data } = await axios.put(`${BASE_URL}/${id}`, cotizacion);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
