import axios from '@/lib/axios';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '@/types';

const BASE_URL = '/productos';

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  },

  getById: async (id: number): Promise<Producto> => {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  },

  getStockBajo: async (): Promise<Producto[]> => {
    const { data } = await axios.get(`${BASE_URL}/stock-bajo`);
    return data;
  },

  create: async (producto: CreateProductoDto): Promise<Producto> => {
    const { data } = await axios.post(BASE_URL, producto);
    return data;
  },

  update: async (producto: UpdateProductoDto): Promise<Producto> => {
    const { data } = await axios.put(`${BASE_URL}/${producto.id}`, producto);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },
};
