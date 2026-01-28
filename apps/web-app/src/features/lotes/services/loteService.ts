import axios from '@/lib/axios';
import type { Lote, CreateLoteDto, UpdateLoteDto } from '@/types';

const BASE_URL = '/lotes';

export const loteService = {
  getAll: async (): Promise<Lote[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Lote> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (lote: CreateLoteDto): Promise<Lote> => {
    const { data } = await axios.post(BASE_URL, lote);
    return data;
  },

  update: async (lote: UpdateLoteDto): Promise<Lote> => {
    const { data } = await axios.put(`${BASE_URL}/${lote.id}`, lote);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
