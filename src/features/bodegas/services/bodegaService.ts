import axios from '@/lib/axios';
import type { Bodega, CreateBodegaDto, UpdateBodegaDto } from '@/types';

const BASE_URL = '/bodegas';

export const bodegaService = {
  getAll: async (): Promise<Bodega[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Bodega> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (bodega: CreateBodegaDto): Promise<Bodega> => {
    const { data } = await axios.post(BASE_URL, bodega);
    return data;
  },

  update: async (bodega: UpdateBodegaDto): Promise<Bodega> => {
    const { data } = await axios.put(`${BASE_URL}/${bodega.id}`, bodega);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
